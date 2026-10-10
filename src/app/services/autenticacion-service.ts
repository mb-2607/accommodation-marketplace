import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    catchError,
    map,
    of,
    switchMap,
    tap,
    timeout
} from 'rxjs';
import {CorreoService} from './correo-service';

export interface RespuestaAutenticacion {
    localId: string;
    email: string;
    idToken: string;
    refreshToken: string;
    expiresIn: string;
    bienvenidaEnviada?: boolean;
}

export interface SesionUsuario {
    uid: string;
    email: string;
    token: string;
    expiraEn: number;
}

@Injectable({
    providedIn: 'root'
})
export class AutenticacionService {
    private cliente = inject(HttpClient);
    private correoService = inject(CorreoService);

    private readonly URL_BASE =
        'https://identitytoolkit.googleapis.com/v1/';
    private readonly API_KEY = 'AIzaSyDkfWORWC9x25siXbHg08_qm-rM-ZNYjJo';
    private readonly CLAVE_SESION = 'reservas-lr-sesion';

    iniciarSesion(correo: string, contrasena: string) {
        return this.cliente.post<RespuestaAutenticacion>(
            this.URL_BASE + 'accounts:signInWithPassword',
            {
                email: correo.trim(),
                password: contrasena,
                returnSecureToken: true
            },
            {
                params: {key: this.API_KEY},
                observe: 'response'
            }
        ).pipe(
            tap(respuesta => {
                if (respuesta.body) {
                    this.guardarSesion(respuesta.body);
                }
            })
        );
    }

    registrarUsuario(correo: string, contrasena: string) {
        return this.cliente.post<RespuestaAutenticacion>(
            this.URL_BASE + 'accounts:signUp',
            {
                email: correo.trim(),
                password: contrasena,
                returnSecureToken: true
            },
            {
                params: {key: this.API_KEY},
                observe: 'response'
            }
        ).pipe(
            tap(respuesta => {
                if (respuesta.body) {
                    this.guardarSesion(respuesta.body);
                }
            }),

            switchMap(respuesta => {
                const datos = respuesta.body;

                if (!datos) {
                    return of(respuesta);
                }

                return this.correoService
                    .enviarBienvenida(datos.email)
                    .pipe(
                        timeout(15000),

                        map(() => respuesta.clone({
                            body: {
                                ...datos,
                                bienvenidaEnviada: true
                            }
                        })),

                        catchError(() => of(
                            respuesta.clone({
                                body: {
                                    ...datos,
                                    bienvenidaEnviada: false
                                }
                            })
                        ))
                    );
            })
        );
    }

    private guardarSesion(
        datos: RespuestaAutenticacion
    ): void {
        if (typeof window === 'undefined') return;

        const sesion: SesionUsuario = {
            uid: datos.localId,
            email: datos.email,
            token: datos.idToken,
            expiraEn:
                Date.now() + Number(datos.expiresIn) * 1000
        };

        sessionStorage.setItem(
            this.CLAVE_SESION,
            JSON.stringify(sesion)
        );
    }

    obtenerSesion(): SesionUsuario | null {
        if (typeof window === 'undefined') return null;

        const datos = sessionStorage.getItem(
            this.CLAVE_SESION
        );

        if (!datos) return null;

        try {
            const sesion = JSON.parse(datos) as SesionUsuario;

            if (
                !sesion.token ||
                !Number.isFinite(sesion.expiraEn) ||
                sesion.expiraEn <= Date.now()
            ) {
                this.cerrarSesion();
                return null;
            }

            return sesion;
        } catch {
            this.cerrarSesion();
            return null;
        }
    }

    cerrarSesion(): void {
        if (typeof window === 'undefined') return;

        sessionStorage.removeItem(this.CLAVE_SESION);
    }
}
