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
import {getApps, initializeApp} from 'firebase/app';
import {
    browserSessionPersistence,
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    signInWithPopup,
    signOut
} from 'firebase/auth';
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

export interface PerfilUsuario {
    nombre: string;
    documento: string;
    fechaNacimiento: string;
    fotoGoogle: string;
    fotoPersonalizada: string;
    registroCompleto?: boolean;
    terminosAceptadosEn?: string;
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
        const app = getApps().find(
            aplicacion => aplicacion.name === 'reservas-lr-google'
        );

        if (app) {
            void signOut(getAuth(app)).catch(() => {
                console.warn('No se pudo cerrar la sesión del SDK de Firebase.');
            });
        }
    }

    private obtenerAuthGoogle() {
        const nombreApp = 'reservas-lr-google';
        const app =
            getApps().find(aplicacion => aplicacion.name === nombreApp) ??
            initializeApp(
                {
                    apiKey: this.API_KEY,
                    authDomain: 'app-marketplace-bfd41.firebaseapp.com',
                    projectId: 'app-marketplace-bfd41'
                },
                nombreApp
            );

        return getAuth(app);
    }

    async iniciarSesionGoogle(): Promise<void> {
        const auth = this.obtenerAuthGoogle();
        await setPersistence(auth, browserSessionPersistence);
        const proveedor = new GoogleAuthProvider();
        proveedor.setCustomParameters({
            prompt: 'select_account'
        });

        const resultado = await signInWithPopup(auth, proveedor);
        const usuario = resultado.user;
        const informacionToken = await usuario.getIdTokenResult();
        this.guardarSesion({
            localId: usuario.uid,
            email: usuario.email ?? '',
            idToken: informacionToken.token,
            refreshToken: usuario.refreshToken,
            expiresIn: String(
                Math.max(
                    0,
                    (Date.parse(informacionToken.expirationTime) - Date.now()) / 1000
                )
            )
        });

        const perfil = this.obtenerPerfil();
        this.guardarPerfil({
            ...perfil,
            nombre: perfil.nombre || usuario.displayName || '',
            fotoGoogle: usuario.photoURL || perfil.fotoGoogle
        });
    }

    obtenerPerfil(): PerfilUsuario {
        const vacio: PerfilUsuario = {
            nombre: '',
            documento: '',
            fechaNacimiento: '',
            fotoGoogle: '',
            fotoPersonalizada: ''
        };

        const sesion = this.obtenerSesion();
        if (!sesion || typeof window === 'undefined') {
            return vacio;
        }

        try {
            const datos = localStorage.getItem(
                `reservas-lr-perfil-${sesion.uid}`
            );

            return datos
                ? {...vacio, ...JSON.parse(datos)}
                : vacio;
        } catch {
            return vacio;
        }
    }

    guardarPerfil(perfil: PerfilUsuario): void {
        const sesion = this.obtenerSesion();
        if (!sesion || typeof window === 'undefined') {
            throw new Error('Debes iniciar sesión para guardar tu perfil.');
        }

        localStorage.setItem(
            `reservas-lr-perfil-${sesion.uid}`,
            JSON.stringify(perfil)
        );
    }

    tieneRegistroCompleto(): boolean {
        if (!this.obtenerSesion()) return false;

        const perfil = this.obtenerPerfil();

        return perfil.registroCompleto === true &&
            !!perfil.terminosAceptadosEn &&
            !!perfil.nombre.trim() &&
            !!perfil.documento &&
            !!perfil.fechaNacimiento;
    }
}
