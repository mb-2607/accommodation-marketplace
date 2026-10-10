import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-soportecomponent',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './soportecomponent.html',
    styleUrl: './soportecomponent.css',
})
export class Soportecomponent {
    opinionRegistrada = false;
    esPositiva = false;

    valorar(respuesta: boolean): void {
        this.opinionRegistrada = true;
        this.esPositiva = respuesta;
    }
}