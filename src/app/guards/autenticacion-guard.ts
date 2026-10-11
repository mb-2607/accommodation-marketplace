import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AutenticacionService} from '../services/autenticacion-service';

export const autenticacionGuard: CanActivateFn = () => {
    const autenticacion = inject(AutenticacionService);
    const router = inject(Router);

    return autenticacion.tieneRegistroCompleto()
        ? true
        : router.createUrlTree(['/login']);
};

export const visitanteGuard: CanActivateFn = () => {
    const autenticacion = inject(AutenticacionService);
    const router = inject(Router);

    return autenticacion.tieneRegistroCompleto()
        ? router.createUrlTree(['/inicio'])
        : true;
};