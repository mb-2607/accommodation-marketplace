import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface DatosCorreoReserva {
    nombreHuesped: string;
    email: string;
    nombreAlojamiento: string;
    fechaLlegada: string;
    fechaSalida: string;
    numeroHuespedes: number;
    numeroNoches: number;
    precioTotal: number;
}

@Injectable({
    providedIn: 'root'
})
export class CorreoService {
    private cliente = inject(HttpClient);
    private readonly URL_BASE = 'https://api.emailjs.com/api/v1.0/';
    private readonly SERVICE_ID = 'service_ku1v69h';
    private readonly TEMPLATE_BIENVENIDA = 'template_mtmnyef';
    private readonly TEMPLATE_RESERVA = 'template_2wtj1xp';
    private readonly PUBLIC_KEY = '4pCriPhDZrQ9jaf-f';

    enviarBienvenida(correo: string) {
        return this.cliente.post(
            this.URL_BASE + 'email/send',
            {
                service_id: this.SERVICE_ID,
                template_id: this.TEMPLATE_BIENVENIDA,
                user_id: this.PUBLIC_KEY,
                template_params: {
                    correo
                }
            },
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    enviarConfirmacion(datos: DatosCorreoReserva) {
        const precioTotal = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(datos.precioTotal);

        return this.cliente.post(
            this.URL_BASE + 'email/send',
            {
                service_id: this.SERVICE_ID,
                template_id: this.TEMPLATE_RESERVA,
                user_id: this.PUBLIC_KEY,
                template_params: {
                    to_email: datos.email,
                    nombre_huesped: datos.nombreHuesped,
                    nombre_alojamiento: datos.nombreAlojamiento,
                    fecha_llegada: datos.fechaLlegada,
                    fecha_salida: datos.fechaSalida,
                    numero_huespedes: datos.numeroHuespedes,
                    numero_noches: datos.numeroNoches,
                    precio_total: precioTotal,
                    estado: 'CONFIRMADA'
                }
            },
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}