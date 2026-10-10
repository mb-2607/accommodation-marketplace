import {ChangeDetectorRef, Component, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Alojamiento} from "../../model/alojamientomodel";
import {Alojamientoservice} from "../../services/alojamientoservice";
import {Resena} from '../../model/resenamodel';
import {ResenaService} from '../../services/resenaservice';

@Component({
    selector: "app-alojamientopagecomponent",
    standalone: false,
    styleUrl: "./alojamientopagecomponent.css",
    templateUrl: "./alojamientopagecomponent.html",
})
export class Alojamientopagecomponent {
    alojamientoId: string = "1";
    alojamiento?: Alojamiento;
    alojamientoService: Alojamientoservice = inject(Alojamientoservice)
    rutaActiva: ActivatedRoute = inject(ActivatedRoute);
    cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    alojamientoExiste: boolean = true;

    ngOnInit() {
        this.rutaActiva.params.subscribe(params => {
            this.alojamientoId = params['id'];
            this.alojamientoService.getAlojamientoById(parseInt(this.alojamientoId)).subscribe((data?: Alojamiento) => {
                this.alojamiento = data;
                if (data !== undefined) {
                    this.alojamientoExiste = true;
                    this.cargarResenas(data.id);
                } else {
                    this.alojamientoExiste = false;
                    this.resenas = [];
                }

                this.cdr.markForCheck();
            })
        })
    }

    private resenaService = inject(ResenaService);
    resenas: Resena[] = [];
    cargandoResenas = false;
    errorResenas = '';

    private cargarResenas(alojamientoId: number): void {
        this.resenas = [];
        this.cargandoResenas = true;
        this.errorResenas = '';
        this.resenaService
            .getResenasByAlojamientoId(alojamientoId)
            .subscribe({
                next: resenas => {
                    this.resenas = resenas;
                    this.cargandoResenas = false;
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.errorResenas =
                        'No se pudieron cargar las reseñas.';
                    this.cargandoResenas = false;
                    this.cdr.markForCheck();
                }
            });
    }
}
