import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-terminocomponent',
    standalone: false,
    templateUrl: './terminocomponent.html',
    styleUrl: './terminocomponent.css',
})
export class Terminocomponent implements OnInit {
    activo = false;
    error = false;
    animandoExit = false;
    animandoShake = false;

    ngOnInit(): void {
        const aceptado = localStorage.getItem('terminosAceptados');
        if (!aceptado) {
            this.activo = true;
        }
    }

    aceptar(): void {
        this.error = false;
        this.animandoExit = true;

        setTimeout(() => {
            localStorage.setItem('terminosAceptados', 'true');
            this.activo = false;
            this.animandoExit = false;
        }, 350);
    }

    rechazar(): void {
        this.error = true;
        this.animandoShake = true;

        setTimeout(() => {
            this.animandoShake = false;
        }, 400);
    }
}