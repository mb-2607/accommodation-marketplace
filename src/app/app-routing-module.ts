import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Alojamientopagecomponent} from "./components/alojamientopagecomponent/alojamientopagecomponent";
import {Iniciocomponent} from "./components/iniciocomponent/iniciocomponent";

const routes: Routes = [
    { path: '', component: Iniciocomponent },
    { path: 'alojamiento/:id', component: Alojamientopagecomponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
