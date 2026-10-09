import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Iniciocomponent} from './components/iniciocomponent/iniciocomponent';
import {Logincomponent} from './components/loggincomponent/loggincomponent';
import {Alojamientopagecomponent} from './components/alojamientopagecomponent/alojamientopagecomponent';
import {
    autenticacionGuard,
    visitanteGuard
} from './guards/autenticacion-guard';
import {Filtercomponent} from "./components/filtercomponent/filtercomponent";
import {Confirmarreservacomponent} from "./components/confirmarreservacomponent/confirmarreservacomponent";
import {Reservacomponent} from "./components/reservacomponent/reservacomponent";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Logincomponent,
        canActivate: [visitanteGuard]
    },
    {
        path: 'filter',
        component: Filtercomponent
    },
    {
        path: 'confirmar-reserva',
        component: Confirmarreservacomponent
    },
    {
        path: '',
        canActivateChild: [autenticacionGuard],
        children: [
            {
                path: 'inicio',
                component: Iniciocomponent
            },
            {
                path: 'alojamiento/:id',
                component: Alojamientopagecomponent
            },
            {
                path: 'reservas',
                component: Reservacomponent
            },
            {
                path: 'alojamientos',
                redirectTo: 'reservas',
                pathMatch: 'full'
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'inicio'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}