import {
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';

import {Alojamientoservice} from './services/alojamientoservice';
import {AutenticacionService} from './services/autenticacion-service';

@Component({
    selector: 'app-root',
    standalone: false,
    styleUrl: './app.css',
    templateUrl: './app.html'
})
export class App implements OnInit {
    protected readonly title = signal('lralojamiento');
    as: Alojamientoservice = inject(Alojamientoservice);
    private autenticacion = inject(AutenticacionService);

    get mostrarContenido(): boolean {
        return this.autenticacion.obtenerSesion() !== null;
    }

    ngOnInit(): void {
        this.as.getAlojamientos().subscribe({
            next: data => console.log('Alojamientos:', data),
            error: error => console.error('Error al consultar alojamientos:', error)
        });

        this.as.getAlojamientoById(1).subscribe({
            next: data => console.log('Alojamiento 1:', data),
            error: error => console.error('Error al consultar el alojamiento:', error)
        });

        this.as.getAlojamientosByContains('partamento').subscribe({
            next: data => console.log('Resultados de búsqueda:', data),
            error: error => console.error('Error en la búsqueda:', error)
        });

        this.as.getAlojamientosByFilter({
            servicios: ['Wi-Fi', 'Parqueadero']
        }).subscribe({
            next: data => console.log('Alojamientos filtrados:', data),
            error: error => console.error('Error al filtrar alojamientos:', error)
        });
    }
}