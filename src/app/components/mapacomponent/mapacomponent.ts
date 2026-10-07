import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import * as L from 'leaflet';
import type {FeatureCollection} from 'geojson';

@Component({
  selector: 'app-mapa-colombia',
  standalone: false,
  templateUrl: './mapacomponent.html',
  styleUrls: ['./mapacomponent.css']
})
export class Mapacomponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa', {static: true})
  mapaElemento!: ElementRef<HTMLDivElement>;
  private mapa?: L.Map;
  private departamentos?: L.GeoJSON;
  private destruido = false;
  error = '';
  departamentoActivo = '';
  constructor(
    private router: Router,
    private zone: NgZone
  ) {
  }

  async ngAfterViewInit(): Promise<void> {
    this.mapa = L.map(this.mapaElemento.nativeElement, {
      zoomSnap: 0,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: false
    }).setView([4.5, -74], 5);

    try {
      const respuesta = await fetch(
        'assets/colombia-departamentos.geojson'
      );

      if (!respuesta.ok) {
        throw new Error(
          `Error al cargar el mapa: ${respuesta.status}`
        );
      }

      const datos: FeatureCollection = await respuesta.json();

      if (this.destruido) return;

      this.departamentos = L.geoJSON(datos, {
        style: {
          color: '#ffffff',
          weight: 1,
          fillColor: '#c8a951',
          fillOpacity: 0.85
        },

        onEachFeature: (feature, layer) => {
          const propiedades = feature.properties ?? {};

          const nombre = String(
            propiedades['dpto_nombre'] ?? 'Departamento'
          );

          const etiqueta = document.createElement('span');
          etiqueta.textContent = nombre;

          layer.bindTooltip(etiqueta, {
            sticky: true,
            direction: 'top'
          });

          layer.on({
            mouseover: () => {
              this.zone.run(() => {
                this.departamentoActivo = nombre;
              });

              const poligono = layer as L.Path;

              poligono.setStyle({
                fillColor: '#f0ce70',
                fillOpacity: 1,
                weight: 2
              });

              poligono.bringToFront();
            },

            mouseout: () => {
              this.departamentos?.resetStyle(layer as L.Path);
            },

            click: () => {
              this.zone.run(() => {
                this.departamentoActivo = nombre;

                this.router.navigate(['/alojamientos'], {
                  queryParams: {
                    departamento: nombre
                  }
                });
              });
            }
          });
        }
      }).addTo(this.mapa!);

      this.mapa!.invalidateSize();
      this.mapa!.fitBounds(this.departamentos.getBounds(), {
        padding: [5, 5]
      });

    } catch (error) {
      if (this.destruido) return;

      this.zone.run(() => {
        this.error = 'No se pudo cargar el mapa de Colombia.';
      });

      console.error(error);
    }
  }

  ngOnDestroy(): void {
    this.destruido = true;
    this.mapa?.remove();
  }
}
