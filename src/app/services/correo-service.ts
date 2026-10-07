import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CorreoService {
    private cliente = inject(HttpClient);

    private readonly URL_BASE =
        'https://api.emailjs.com/api/v1.0/';

    private readonly SERVICE_ID = 'service_ku1v69h';
    private readonly TEMPLATE_ID = 'template_mtmnyef';
    private readonly PUBLIC_KEY = '4pCriPhDZrQ9jaf-f';

    enviarBienvenida(correo: string) {
        return this.cliente.post(
            this.URL_BASE + 'email/send',
            {
                service_id: this.SERVICE_ID,
                template_id: this.TEMPLATE_ID,
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
}
