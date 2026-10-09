import {ChangeDetectorRef, Component, inject, Input} from "@angular/core";
import {Alojamiento} from "../../model/alojamientomodel";
import {Cotizacionservice} from "../../services/cotizacionservice";
import {Cotizacion, CotizacionInvalida, ErrorType} from "../../model/cotizacionmodel";
import {ReservaService} from "../../services/reservaservice";
import {Router} from "@angular/router";

@Component({
  selector: "app-cotizacioncomponent",
  standalone: false,
  styleUrl: "./cotizacioncomponent.css",
  templateUrl: "./cotizacioncomponent.html",
})
export class Cotizacioncomponent {
    @Input({ required: true }) alojamiento?: Alojamiento;

    cdr :ChangeDetectorRef = inject(ChangeDetectorRef);
    reservaService :ReservaService = inject(ReservaService);
    router :Router = inject(Router);

    cotizacionService: Cotizacionservice = inject(Cotizacionservice);
    fechaInicio :string = new Date().toISOString().split('T')[0];
    fechaFin :string = new Date().toISOString().split('T')[0];
    cotizacionValida : boolean = false;
    cotizacion? :Cotizacion;
    cantidadHuespedes :number = 0;

    isFechaInvalida: boolean = false;
    isHuespedesMenorACero :boolean = false;
    isHuespedesMayorACapacidad :boolean = false;

    addCantidadHuespedes() :void {
        if(this.cantidadHuespedes < 20){
            this.cantidadHuespedes++;
        }
    }

    restCantidadHuespedes() :void {
        if(this.cantidadHuespedes > 0) {
            this.cantidadHuespedes--;
        }
    }

    realizarCotizacion():void{
        if(!this.alojamiento){
            return;
        }
        let resultado :Cotizacion|CotizacionInvalida = this.cotizacionService.crearCotizacion(this.fechaInicio, this.fechaFin, this.cantidadHuespedes, this.alojamiento);
        if('total' in resultado){
            this.cotizacion = resultado;
            this.cotizacionValida = true;
            this.isFechaInvalida = false;
            this.isHuespedesMayorACapacidad = false;
            this.isHuespedesMenorACero = false;
        } else {
            this.cotizacionValida = false;
            this.isFechaInvalida = resultado.errores.includes(ErrorType.FECHA_INVALIDA);
            this.isHuespedesMayorACapacidad = resultado.errores.includes(ErrorType.CANTIDAD_HUESPEDES_MAYOR_A_CAPACIDAD);
            this.isHuespedesMenorACero = resultado.errores.includes(ErrorType.CANTIDAD_HUESPEDES_MENOR_A_UNO);

        }
        this.cdr.markForCheck();
    }

    irAReservar(){
        if(this.cotizacion && 'total' in this.cotizacion){
            this.reservaService.seleccionarCotizacion(this.cotizacion);
            this.router.navigate(['/confirmar-reserva']);
        }
    }
}
