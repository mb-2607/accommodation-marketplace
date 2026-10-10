import {ChangeDetectorRef, Component, inject, Input} from "@angular/core";
import {Alojamiento} from "../../model/alojamientomodel";
import {Cotizacionservice} from "../../services/cotizacionservice";
import {
    Cotizacion,
    CotizacionInvalida,
    ErrorType
} from "../../model/cotizacionmodel";
import {ReservaService} from "../../services/reservaservice";
import {Router} from "@angular/router";

@Component({
    selector: "app-cotizacioncomponent",
    standalone: false,
    styleUrl: "./cotizacioncomponent.css",
    templateUrl: "./cotizacioncomponent.html",
})
export class Cotizacioncomponent {
    @Input({required: true}) alojamiento?: Alojamiento;
    cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    reservaService: ReservaService = inject(ReservaService);
    router: Router = inject(Router);
    cotizacionService: Cotizacionservice = inject(Cotizacionservice);
    readonly fechaHoy = this.obtenerFechaLocal();
    fechaInicio: string = this.fechaHoy;
    fechaFin: string = this.fechaMinimaSalida;
    cotizacionValida: boolean = false;
    cotizacion?: Cotizacion;
    cantidadHuespedes: number = 0;
    isFechaInvalida: boolean = false;
    isHuespedesMenorACero: boolean = false;
    isHuespedesMayorACapacidad: boolean = false;

    private obtenerFechaLocal(): string {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }

    get fechaMinimaSalida(): string {
        const hoy = this.obtenerFechaLocal();
        const fechaBase =
            this.fechaInicio && this.fechaInicio >= hoy
                ? this.fechaInicio
                : hoy;

        const [anio, mes, dia] = fechaBase.split("-").map(Number);
        const siguienteDia = new Date(anio, mes - 1, dia);
        siguienteDia.setDate(siguienteDia.getDate() + 1);
        const anioSalida = siguienteDia.getFullYear();
        const mesSalida = String(
            siguienteDia.getMonth() + 1
        ).padStart(2, "0");
        const diaSalida = String(
            siguienteDia.getDate()
        ).padStart(2, "0");
        return `${anioSalida}-${mesSalida}-${diaSalida}`;
    }

    addCantidadHuespedes(): void {
        if (this.cantidadHuespedes < 20) {
            this.cantidadHuespedes++;
        }
    }

    restCantidadHuespedes(): void {
        if (this.cantidadHuespedes > 0) {
            this.cantidadHuespedes--;
        }
    }

    realizarCotizacion(): void {
        this.cotizacionValida = false;
        this.cotizacion = undefined;
        this.isFechaInvalida = false;
        this.isHuespedesMayorACapacidad = false;
        this.isHuespedesMenorACero = false;
        if (!this.alojamiento) {
            return;
        }

        if (
            !this.fechaInicio ||
            !this.fechaFin ||
            this.fechaInicio < this.obtenerFechaLocal() ||
            this.fechaFin <= this.fechaInicio
        ) {
            this.isFechaInvalida = true;
            this.cdr.markForCheck();
            return;
        }

        const resultado: Cotizacion | CotizacionInvalida =
            this.cotizacionService.crearCotizacion(
                this.fechaInicio,
                this.fechaFin,
                this.cantidadHuespedes,
                this.alojamiento
            );

        if ("total" in resultado) {
            this.cotizacion = resultado;
            this.cotizacionValida = true;
        } else {
            this.isFechaInvalida =
                resultado.errores.includes(
                    ErrorType.FECHA_INVALIDA
                );

            this.isHuespedesMayorACapacidad =
                resultado.errores.includes(
                    ErrorType.CANTIDAD_HUESPEDES_MAYOR_A_CAPACIDAD
                );

            this.isHuespedesMenorACero =
                resultado.errores.includes(
                    ErrorType.CANTIDAD_HUESPEDES_MENOR_A_UNO
                );
        }

        this.cdr.markForCheck();
    }

    irAReservar(): void {
        if (this.cotizacionValida && this.cotizacion) {
            this.reservaService.seleccionarCotizacion(
                this.cotizacion
            );

            this.router.navigate(["/confirmar-reserva"]);
        }
    }
}