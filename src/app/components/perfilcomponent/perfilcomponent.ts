import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import {Router} from '@angular/router';
import {
    AutenticacionService,
    PerfilUsuario,
    SesionUsuario
} from '../../services/autenticacion-service';

@Component({
    selector: 'app-perfilcomponent',
    standalone: false,
    templateUrl: './perfilcomponent.html',
    styleUrl: './perfilcomponent.css'
})
export class Perfilcomponent implements OnInit {
    private autenticacion = inject(AutenticacionService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    sesion: SesionUsuario | null = null;
    perfil: PerfilUsuario = {
        nombre: '',
        documento: '',
        fechaNacimiento: '',
        fotoGoogle: '',
        fotoPersonalizada: ''
    };

    mensaje = '';
    esError = false;
    fotoFallida = false;

    readonly patronNombre = "^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$";
    readonly fechaMaxima = this.fechaLocal(new Date());

    ngOnInit(): void {
        this.sesion = this.autenticacion.obtenerSesion();

        if (!this.sesion) {
            void this.router.navigate(['/login']);
            return;
        }

        this.perfil = this.autenticacion.obtenerPerfil();
    }

    get foto(): string {
        return this.perfil.fotoPersonalizada || this.perfil.fotoGoogle;
    }

    get iniciales(): string {
        const nombre = this.perfil.nombre.trim();

        if (!nombre) {
            return this.sesion?.email.charAt(0).toUpperCase() || 'LR';
        }

        return nombre
            .split(/\s+/)
            .slice(0, 2)
            .map(parte => parte.charAt(0))
            .join('')
            .toUpperCase();
    }

    private fechaLocal(fecha: Date): string {
        return [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, '0'),
            String(fecha.getDate()).padStart(2, '0')
        ].join('-');
    }

    private nacimientoValido(): boolean {
        const valor = this.perfil.fechaNacimiento;
        if (!valor) return true;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
        const [anio, mes, dia] = valor.split('-').map(Number);
        const fecha = new Date(anio, mes - 1, dia);
        const hoy = new Date();

        if (
            fecha.getFullYear() !== anio ||
            fecha.getMonth() !== mes - 1 ||
            fecha.getDate() !== dia ||
            valor > this.fechaLocal(hoy)
        ) {
            return false;
        }

        let edad = hoy.getFullYear() - anio;

        if (
            hoy.getMonth() < mes - 1 ||
            (hoy.getMonth() === mes - 1 && hoy.getDate() < dia)
        ) {
            edad--;
        }

        return edad >= 0 && edad <= 100;
    }

    guardar(): void {
        this.mensaje = '';
        this.esError = false;
        const nombre = this.perfil.nombre.trim();

        if (
            nombre.length < 2 ||
            nombre.length > 100 ||
            !new RegExp(this.patronNombre).test(nombre)
        ) {
            this.esError = true;
            this.mensaje = 'Escribe un nombre válido, únicamente con letras y espacios.';
            return;
        }

        if (
            this.perfil.documento &&
            !/^[0-9]{5,20}$/.test(this.perfil.documento)
        ) {
            this.esError = true;
            this.mensaje = 'El documento debe tener entre 5 y 20 números.';
            return;
        }

        if (!this.nacimientoValido()) {
            this.esError = true;
            this.mensaje = 'Selecciona una fecha válida y una edad de máximo 100 años.';
            return;
        }

        try {
            this.perfil.nombre = nombre;
            this.autenticacion.guardarPerfil(this.perfil);
            this.mensaje = 'Tu perfil se guardó correctamente.';
        } catch {
            this.esError = true;
            this.mensaje = 'No se pudo guardar el perfil. Comprueba tu sesión y el almacenamiento del navegador.';
        }
    }

    cambiarFoto(evento: Event): void {
        const entrada = evento.target as HTMLInputElement;
        const archivo = entrada.files?.[0];
        entrada.value = '';
        if (!archivo) return;

        if (
            !['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type) ||
            archivo.size > 1024 * 1024
        ) {
            this.esError = true;
            this.mensaje = 'Selecciona una imagen JPG, PNG o WebP de máximo 1 MB.';
            return;
        }

        const lector = new FileReader();
        lector.onload = () => {
            const resultado = lector.result;
            if (typeof resultado === 'string') {
                this.perfil.fotoPersonalizada = resultado;
                this.fotoFallida = false;
                this.esError = false;
                this.mensaje = 'Foto seleccionada. Pulsa Guardar cambios para conservarla.';
            }

            this.cdr.markForCheck();
        };

        lector.onerror = () => {
            this.esError = true;
            this.mensaje = 'No se pudo leer la imagen.';
            this.cdr.markForCheck();
        };

        lector.readAsDataURL(archivo);
    }

    restaurarFoto(): void {
        this.perfil.fotoPersonalizada = '';
        this.fotoFallida = false;
        this.esError = false;
        this.mensaje = 'Pulsa Guardar cambios para conservar esta selección.';
    }

    cerrarSesion(): void {
        this.autenticacion.cerrarSesion();
        void this.router.navigate(['/login']);
    }
}