import {Injectable} from "@angular/core";
import {Cotizacion, CotizacionInvalida, ErrorType} from "../model/cotizacionmodel";
import {Alojamiento} from "../model/alojamientomodel";

@Injectable({
    providedIn: 'root'
})
export class Cotizacionservice {
    crearCotizacion(fechaEntrada :string, fechaSalida :string, huespedes :number, alojamiento :Alojamiento): Cotizacion|CotizacionInvalida{
        let fechaValida :boolean = fechaEntrada < fechaSalida;
        let huespedMenorACapacidad :boolean = huespedes <= alojamiento.capacidad;
        let huespedMayoraCero :boolean = huespedes > 0;

        if(fechaValida && huespedMayoraCero && huespedMenorACapacidad){
            let alojamientoId :number = alojamiento.id;
            let numeroNoches :number = this.calcularNoches(fechaEntrada, fechaSalida);
            let subtotal :number = alojamiento.precioNoche * numeroNoches;
            let tarifaLimpieza :number = alojamiento.tarifaLimpieza;
            let tarifaServicio :number = subtotal/10;
            let total :number = subtotal + tarifaLimpieza + tarifaServicio;

            let cotizacion :Cotizacion = {
                alojamientoId: alojamientoId,
                fechaLlegada: fechaEntrada,
                fechaSalida: fechaSalida,
                numeroHuespedes: huespedes,
                numeroNoches: numeroNoches,
                precioNoche: alojamiento.precioNoche,
                subtotal: subtotal,
                tarifaLimpieza: tarifaLimpieza,
                tarifaServicio: tarifaServicio,
                total: total
            }

            return cotizacion;
        }
        else {
            let errores: ErrorType[] = [];
            if(!fechaValida){
                errores.push(ErrorType.FECHA_INVALIDA)
            }
            if(!huespedMayoraCero){
                errores.push(ErrorType.CANTIDAD_HUESPEDES_MENOR_A_UNO)
            }

            if(!huespedMenorACapacidad){
                errores.push(ErrorType.CANTIDAD_HUESPEDES_MAYOR_A_CAPACIDAD)
            }

            return {
                errores: errores
            }
        }
    }

    calcularNoches(fechaEntrada :string, fechaSalida: string) {
        const inicio = new Date(fechaEntrada);
        const fin = new Date(fechaSalida);

        const diferenciaMs = fin.getTime() - inicio.getTime();
        const msPorDia = 1000 * 60 * 60 * 24;
        return Math.round(diferenciaMs / msPorDia);
    }
}
