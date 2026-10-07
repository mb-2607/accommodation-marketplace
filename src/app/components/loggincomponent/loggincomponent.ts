import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject
} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AutenticacionService} from '../../../../../accommodation-marketplace/src/app/services/autenticacion-service';

@Component({
    selector: 'app-loggincomponent',
    standalone: false,
    templateUrl: './loggincomponent.html',
    styleUrl: './loggincomponent.css'
})
export class Logincomponent {
    correo = '';
    contrasena = '';
    confirmacion = '';
    mensaje = '';
    cargando = false;
    modoRegistro = false;
    mostrarContrasena = false;
    private autenticacionService = inject(AutenticacionService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);

    cambiarModo(): void {
        if (this.cargando) return;

        this.modoRegistro = !this.modoRegistro;
        this.mensaje = '';
        this.contrasena = '';
        this.confirmacion = '';
        this.mostrarContrasena = false;
    }

    iniciarSesion(): void {
        if (this.cargando) return;
        this.mensaje = '';
        const correo = this.correo.trim();
        if (!correo || !this.contrasena) {
            this.mensaje = 'Por favor completa todos los campos.';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            this.mensaje = 'Ingresa un correo electrónico válido.';
            return;
        }

        if (this.modoRegistro) {
            if (this.contrasena.length < 6) {
                this.mensaje =
                    'La contraseña debe tener al menos 6 caracteres.';
                return;
            }

            if (this.contrasena !== this.confirmacion) {
                this.mensaje = 'Las contraseñas no coinciden.';
                return;
            }
        }

        this.cargando = true;

        const solicitud = this.modoRegistro
            ? this.autenticacionService.registrarUsuario(
                correo,
                this.contrasena
            )
            : this.autenticacionService.iniciarSesion(
                correo,
                this.contrasena
            );

        solicitud.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (respuesta) => {
                this.cargando = false;
                const datos = respuesta.body;
                if (!datos) {
                    this.mensaje =
                        'No se recibió la información de la cuenta.';
                    this.cdr.markForCheck();
                    return;
                }

                this.contrasena = '';
                this.confirmacion = '';
                if (this.modoRegistro) {
                    this.mensaje = datos.bienvenidaEnviada
                        ? 'Tu cuenta fue creada. Enviamos el correo de bienvenida; revisa también la carpeta de spam.'
                        : 'Tu cuenta fue creada, pero no pudimos enviar la bienvenida. Ya puedes iniciar sesión.';

                    this.modoRegistro = false;
                    this.cdr.markForCheck();
                    return;
                }

                this.cdr.markForCheck();
                this.router.navigate(['/inicio']);
            },

            error: (error: HttpErrorResponse) => {
                console.error('Estado HTTP:', error.status);
                console.error(
                    'Mensaje Firebase:',
                    error.error?.error?.message
                );
                this.cargando = false;
                this.mensaje = this.obtenerMensajeError(error);
                this.cdr.markForCheck();
            }
        });
    }

    private obtenerMensajeError(error: HttpErrorResponse): string {
        if (error.status === 0) {
            return 'No fue posible conectar. Revisa tu conexión.';
        }

        const codigo = String(
            error.error?.error?.message ?? ''
        ).split(' : ')[0];

        switch (codigo) {
            case 'EMAIL_EXISTS':
                return 'Ya existe una cuenta con ese correo. Inicia sesión.';

            case 'INVALID_EMAIL':
                return 'El correo electrónico no es válido.';

            case 'WEAK_PASSWORD':
            case 'PASSWORD_DOES_NOT_MEET_REQUIREMENTS':
                return 'La contraseña no cumple los requisitos del proyecto.';

            case 'INVALID_LOGIN_CREDENTIALS':
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                return 'El correo o la contraseña son incorrectos.';

            case 'USER_DISABLED':
                return 'Esta cuenta está deshabilitada.';

            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                return 'Hay demasiados intentos. Inténtalo más tarde.';

            case 'OPERATION_NOT_ALLOWED':
            case 'PASSWORD_LOGIN_DISABLED':
                return 'Debes habilitar correo y contraseña en Firebase.';

            case 'API_KEY_INVALID':
                return 'Revisa la API key configurada en el servicio.';

            default:
                return 'No fue posible completar la solicitud. Inténtalo de nuevo.';
        }
    }
}
