import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {combineLatest} from 'rxjs';
import {Alojamiento} from '../../model/alojamientomodel';
import {Alojamientoservice} from "../../services/alojamientoservice";

interface TarjetaAlojamiento {
    alojamiento: Alojamiento;
    imagenes: string[];
    indiceImagen: number;
}

@Component({
    selector: 'app-reservacomponent',
    standalone: false,
    templateUrl: './reservacomponent.html',
    styleUrls: ['./reservacomponent.css']
})
export class Reservacomponent implements OnInit {
    private readonly alojamientoService = inject(Alojamientoservice);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cdr = inject(ChangeDetectorRef);

    alojamientos: Alojamiento[] = [];
    tarjetas: TarjetaAlojamiento[] = [];
    departamentos: string[] = [];
    ciudades: string[] = [];
    tipos: string[] = [];
    departamentoSeleccionado = '';
    ciudadSeleccionada = '';
    tipoSeleccionado = '';
    huespedes: number | null = null;
    precioMaximo: number | null = null;
    ordenSeleccionado = 'calificacion';
    cargando = true;
    error = '';

    readonly imagenAlternativa =
        'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg"
           width="800" height="500" viewBox="0 0 800 500">
        <rect width="800" height="500" fill="#eeeae0"/>
        <path d="M300 290V205L400 140L500 205V290"
              fill="none" stroke="#a88a36" stroke-width="12"/>
        <path d="M375 290V230H425V290"
              fill="none" stroke="#a88a36" stroke-width="10"/>
        <text x="400" y="360"
              text-anchor="middle"
              fill="#716b5c"
              font-family="sans-serif"
              font-size="24">
          Imagen no disponible
        </text>
      </svg>
    `);

    ngOnInit(): void {
        combineLatest([
            this.alojamientoService.getAlojamientos(),
            this.route.queryParamMap
        ])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ([alojamientos, parametros]) => {
                    this.alojamientos = alojamientos.filter(
                        alojamiento => alojamiento.activo
                    );

                    this.departamentos = this.obtenerValoresUnicos(
                        this.alojamientos.map(
                            alojamiento => alojamiento.departamento
                        )
                    );

                    this.tipos = this.obtenerValoresUnicos(
                        this.alojamientos.map(
                            alojamiento => alojamiento.tipo
                        )
                    );

                    const departamento =
                        parametros.get('departamento')?.trim() ?? '';

                    this.departamentoSeleccionado =
                        this.departamentos.find(nombre =>
                            this.normalizar(nombre) ===
                            this.normalizar(departamento)
                        ) ?? departamento;

                    this.ciudadSeleccionada = '';
                    this.actualizarCiudades();
                    this.aplicarFiltros();
                    this.cargando = false;
                    this.error = '';
                    this.cdr.markForCheck();
                },

                error: () => {
                    this.cargando = false;
                    this.error =
                        'No se pudieron cargar los alojamientos. Revisa la ubicación y el contenido del JSON.';

                    this.cdr.markForCheck();
                }
            });
    }

    cambiarDepartamento(): void {
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                departamento: this.departamentoSeleccionado || null
            },
            queryParamsHandling: 'merge'
        });
    }

    aplicarFiltros(): void {
        const departamento = this.normalizar(
            this.departamentoSeleccionado
        );

        const ciudad = this.normalizar(this.ciudadSeleccionada);

        const resultados = this.alojamientos.filter(alojamiento => {
            const coincideDepartamento =
                !departamento ||
                this.normalizar(alojamiento.departamento) === departamento;

            const coincideCiudad =
                !ciudad ||
                this.normalizar(alojamiento.ciudad) === ciudad;

            const coincideTipo =
                !this.tipoSeleccionado ||
                alojamiento.tipo === this.tipoSeleccionado;

            const coincideHuespedes =
                this.huespedes === null ||
                (
                    Number.isInteger(this.huespedes) &&
                    this.huespedes > 0 &&
                    alojamiento.capacidad >= this.huespedes
                );

            const coincidePrecio =
                this.precioMaximo === null ||
                alojamiento.precioNoche <= this.precioMaximo;

            return (
                alojamiento.activo &&
                coincideDepartamento &&
                coincideCiudad &&
                coincideTipo &&
                coincideHuespedes &&
                coincidePrecio
            );
        });

        switch (this.ordenSeleccionado) {
            case 'precio-menor':
                resultados.sort(
                    (a, b) => a.precioNoche - b.precioNoche
                );
                break;

            case 'precio-mayor':
                resultados.sort(
                    (a, b) => b.precioNoche - a.precioNoche
                );
                break;

            default:
                resultados.sort(
                    (a, b) => b.calificacion - a.calificacion
                );
        }

        const indicesAnteriores = new Map(
            this.tarjetas.map(tarjeta => [
                tarjeta.alojamiento.id,
                tarjeta.indiceImagen
            ])
        );

        this.tarjetas = resultados.map(alojamiento => {
            const imagenes = [...new Set(
                [
                    alojamiento.imagenPrincipal,
                    ...(alojamiento.imagenes ?? [])
                ].filter(imagen =>
                    typeof imagen === 'string' && imagen.trim().length > 0
                )
            )];

            if (imagenes.length === 0) {
                imagenes.push(this.imagenAlternativa);
            }

            return {
                alojamiento,
                imagenes,
                indiceImagen: Math.min(
                    indicesAnteriores.get(alojamiento.id) ?? 0,
                    imagenes.length - 1
                )
            };
        });
    }

    limpiarFiltros(): void {
        this.departamentoSeleccionado = '';
        this.ciudadSeleccionada = '';
        this.tipoSeleccionado = '';
        this.huespedes = null;
        this.precioMaximo = null;
        this.ordenSeleccionado = 'calificacion';
        this.actualizarCiudades();
        this.aplicarFiltros();
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                departamento: null
            },
            queryParamsHandling: 'merge'
        });
    }

    anteriorImagen(tarjeta: TarjetaAlojamiento): void {
        tarjeta.indiceImagen =
            (
                tarjeta.indiceImagen -
                1 +
                tarjeta.imagenes.length
            ) % tarjeta.imagenes.length;
    }

    siguienteImagen(tarjeta: TarjetaAlojamiento): void {
        tarjeta.indiceImagen =
            (tarjeta.indiceImagen + 1) %
            tarjeta.imagenes.length;
    }

    seleccionarImagen(
        tarjeta: TarjetaAlojamiento,
        indice: number
    ): void {
        tarjeta.indiceImagen = indice;
    }

    imagenFallida(evento: Event): void {
        const imagen = evento.target as HTMLImageElement;

        if (imagen.getAttribute('src') !== this.imagenAlternativa) {
            imagen.src = this.imagenAlternativa;
        }
    }

    trackPorId(
        indice: number,
        tarjeta: TarjetaAlojamiento
    ): number {
        return tarjeta.alojamiento.id;
    }

    private actualizarCiudades(): void {
        const departamento = this.normalizar(
            this.departamentoSeleccionado
        );

        this.ciudades = this.obtenerValoresUnicos(
            this.alojamientos
                .filter(alojamiento =>
                    !departamento ||
                    this.normalizar(alojamiento.departamento) === departamento
                )
                .map(alojamiento => alojamiento.ciudad)
        );
    }

    private obtenerValoresUnicos(valores: string[]): string[] {
        return [...new Set(valores)]
            .sort((a, b) => a.localeCompare(b, 'es'));
    }

    private normalizar(valor: string): string {
        const texto = valor
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

        const equivalencias: Record<string, string> = {
            bogota: 'bogotadc',
            bogotadistritocapital: 'bogotadc',
            santafedebogota: 'bogotadc',
            guajira: 'laguajira',
            sanandres: 'sanandresyprovidencia',
            sanandresprovidencia: 'sanandresyprovidencia',
            archipielagodesanandresprovidenciaysantacatalina:
                'sanandresyprovidencia',
            sanandresprovidenciaysantacatalina:
                'sanandresyprovidencia',
            sanandresyprovidenciaysantacatalina:
                'sanandresyprovidencia'
        };

        return equivalencias[texto] ?? texto;
    }
}