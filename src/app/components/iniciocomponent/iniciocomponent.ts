import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';

import {Alojamiento} from '../../model/alojamientomodel';
import {Alojamientoservice} from '../../services/alojamientoservice';

@Component({
    selector: 'app-iniciocomponent',
    standalone: false,
    templateUrl: './iniciocomponent.html',
    styleUrl: './iniciocomponent.css'
})
export class Iniciocomponent implements OnInit, OnDestroy {
    readonly nombreEmpresa = 'Reservas LR';
    readonly imagenBienvenida = 'assets/lugarcolombia.png';
    readonly descripcionImagen =
        'Alojamiento acogedor para una estancia especial';
    alojamientosCarrusel: Alojamiento[] = [];
    indiceCarrusel = 0;
    cargandoCarrusel = true;
    errorCarrusel = '';
    indicePublicidad = 0;
    private intervaloPublicidad?: ReturnType<typeof setInterval>;
    private reducirMovimiento = false;
    private destruido = false;

    readonly publicidades = [
        {
            imagen: 'assets/images/publicidad-nacional.jpg',
            alt: 'Alojamiento para disfrutar una estancia en Colombia',
            etiqueta: 'DESTINOS EN TODA COLOMBIA',
            titulo: 'Tu lugar ideal',
            destacado: 'para cada ocasión',
            descripcion:
                'Encuentra alojamientos en todo el país para vacaciones, viajes de trabajo o momentos especiales. Elige el espacio que mejor se adapte a ti.',
            precio: '',
            detalle: ''
        },
        {
            imagen: 'assets/images/publicidad-precios.jpg',
            alt: 'Estancia cómoda para unas vacaciones',
            etiqueta: 'PLANEA TU PRÓXIMA ESCAPADA',
            titulo: 'Más experiencias',
            destacado: 'a tu presupuesto',
            descripcion:
                'Explora precios por noche, selecciona las fechas de tu estancia y conoce el valor total antes de reservar. Planea tu viaje con claridad.',
            precio: '',
            detalle: ''
        },
        {
            imagen: 'assets/images/publicidad-ocasiones.jpg',
            alt: 'Alojamiento amplio para compartir con familia o amigos',
            etiqueta: 'MOMENTOS PARA COMPARTIR',
            titulo: 'Viaja en buena compañía',
            destacado: 'crea nuevos recuerdos',
            descripcion:
                'En pareja, con amigos o en familia: descubre apartamentos, casas y cabañas con el espacio y las comodidades que necesitas.',
            precio: '',
            detalle: ''
        }
    ];

    constructor(
        private alojamientosService: Alojamientoservice,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.cargandoCarrusel = true;
        this.errorCarrusel = '';
        this.alojamientosService.getAlojamientos().subscribe({
            next: (alojamientos) => {
                this.alojamientosCarrusel = alojamientos
                    .filter(alojamiento => alojamiento.activo)
                    .slice(0, 5);

                this.indiceCarrusel = 0;
                this.cargandoCarrusel = false;
                this.cdr.markForCheck();
            },

            error: (error) => {
                this.alojamientosCarrusel = [];
                this.cargandoCarrusel = false;
                this.errorCarrusel =
                    'No se pudieron cargar los alojamientos destacados.';

                console.error('Error al cargar el carrusel:', error);
                this.cdr.markForCheck();
            }
        });

        this.iniciarPublicidad();
    }

    seleccionarImagen(indice: number): void {
        this.indiceCarrusel = indice;
    }

    anteriorImagen(): void {
        const cantidad = this.alojamientosCarrusel.length;
        if (cantidad === 0) return;

        this.indiceCarrusel =
            (this.indiceCarrusel - 1 + cantidad) % cantidad;
    }

    siguienteImagen(): void {
        const cantidad = this.alojamientosCarrusel.length;
        if (cantidad === 0) return;

        this.indiceCarrusel =
            (this.indiceCarrusel + 1) % cantidad;
    }

    iniciarPublicidad(): void {
        if (
            this.destruido ||
            this.reducirMovimiento ||
            typeof window === 'undefined' ||
            this.intervaloPublicidad !== undefined
        ) {
            return;
        }

        this.intervaloPublicidad = setInterval(() => {
            this.indicePublicidad =
                (this.indicePublicidad + 1) % this.publicidades.length;

            this.cdr.markForCheck();
        }, 7000);
    }

    pausarPublicidad(): void {
        if (this.intervaloPublicidad !== undefined) {
            clearInterval(this.intervaloPublicidad);
            this.intervaloPublicidad = undefined;
        }
    }

    ngOnDestroy(): void {
        this.destruido = true;
        this.pausarPublicidad();
    }
}
