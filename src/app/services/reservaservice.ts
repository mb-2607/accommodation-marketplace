import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Reserva} from "../model/reservamodel";
import {Cotizacion} from "../model/cotizacionmodel";
import {AutenticacionService} from "./autenticacion-service";

@Injectable({
    providedIn: 'root'
})
export class ReservaService {
    private listaReservas :BehaviorSubject<Reserva[]> = new BehaviorSubject<Reserva[]>([]);
    private authService :AutenticacionService = inject(AutenticacionService);
    private id :number = 0;
    private cotizacionPendiente = new BehaviorSubject<Cotizacion | null>(null);

    seleccionarCotizacion(cotizacion: Cotizacion): void {
        this.cotizacionPendiente.next(cotizacion);
    }

    getCotizacionPendiente(): Observable<Cotizacion | null> {
        return this.cotizacionPendiente.asObservable();
    }

    agregarReserva(name :string) {
        const cotizacion = this.cotizacionPendiente.getValue();
        const actual = this.listaReservas.getValue();
        const usuario = this.authService.obtenerSesion();
        if(usuario && cotizacion) {
            const nuevaReserva :Reserva = {
                id: this.id++,
                idAlojamiento :cotizacion.alojamientoId,
                userId :usuario.uid,
                userName :name,
                email :usuario.email,
                fechaLlegada :cotizacion.fechaLlegada,
                fechaSalida :cotizacion.fechaSalida,
                numeroHuespedes :cotizacion.numeroHuespedes,
                numeroNoches :cotizacion.numeroNoches,
                precioTotal :cotizacion.total,
                estado :"Aceptado"
            }

            this.listaReservas.next([...actual, nuevaReserva]);
            return true;
        }
        else return false;
    }

    getListaReservas() :Observable<Reserva[]> {
        return this.listaReservas.asObservable();
    }

}
