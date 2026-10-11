import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    OnDestroy,
    Output
} from '@angular/core';

@Component({
    selector: 'app-terminocomponent',
    standalone: false,
    templateUrl: './terminocomponent.html',
    styleUrl: './terminocomponent.css'
})
export class Terminocomponent implements OnDestroy {
    @Output() aceptacion = new EventEmitter<boolean>();
    private cdr = inject(ChangeDetectorRef);
    private temporizador?: ReturnType<typeof setTimeout>;
    activo = true;
    error = false;
    animandoExit = false;
    animandoShake = false;

    aceptar(): void {
        if (this.animandoExit) return;

        this.error = false;
        this.animandoExit = true;

        this.temporizador = setTimeout(() => {
            this.activo = false;
            this.animandoExit = false;
            this.aceptacion.emit(true);
            this.cdr.markForCheck();
        }, 350);
    }

    rechazar(): void {
        this.error = true;
        this.animandoShake = true;
        this.aceptacion.emit(false);

        if (this.temporizador) {
            clearTimeout(this.temporizador);
        }

        this.temporizador = setTimeout(() => {
            this.animandoShake = false;
            this.cdr.markForCheck();
        }, 400);
    }

    ngOnDestroy(): void {
        if (this.temporizador) {
            clearTimeout(this.temporizador);
        }
    }
}