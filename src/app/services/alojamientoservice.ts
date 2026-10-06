import {Injectable, inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Alojamiento} from "../model/alojamientomodel";
import {map, Observable} from "rxjs";
import {FiltroAlojamiento} from "../model/filtroalojamientomodel";


@Injectable({
    providedIn: 'root',
})
export class Alojamientoservice {
    private cliente :HttpClient = inject(HttpClient) as HttpClient;
    private readonly URL_BASE :string = 'assets/data/';

    getAlojamientos() :Observable<Alojamiento[]> {
        return this.cliente.get<Alojamiento[]>(this.URL_BASE+"alojamientos.json").pipe(
            map((alojamientos:Alojamiento[])=> alojamientos.filter((a:Alojamiento) => a.activo))
        )
    }

    getAlojamientoById(id:number):Observable<Alojamiento|undefined> {
        return this.getAlojamientos().pipe(
            map((alojamientos: Alojamiento[]) => alojamientos.find((a: Alojamiento) => a.id === id))
        )
    }

    getAlojamientosByContains(s:string) :Observable<Alojamiento[]> {
        return this.getAlojamientos().pipe(
            map((alojamientos: Alojamiento[]) => alojamientos.filter((a: Alojamiento) => a.nombre.toLowerCase().includes(s.toLowerCase())))
        )
    }

    getAlojamientosByFilter(filtro:FiltroAlojamiento) :Observable<Alojamiento[]> {
        return this.getAlojamientos().pipe(
            map((alojamientos: Alojamiento[]) =>
                alojamientos.filter((a: Alojamiento) => filtro.ciudad === undefined || a.ciudad === filtro.ciudad)
                    .filter((a: Alojamiento) => filtro.huespedes === undefined || a.capacidad >= filtro.huespedes)
                    .filter((a: Alojamiento) => filtro.tipo === undefined || a.tipo === filtro.tipo)
                    .filter((a: Alojamiento) => filtro.precioMin === undefined || a.precioNoche >= filtro.precioMin)
                    .filter((a: Alojamiento) => filtro.precioMax === undefined || a.precioNoche <= filtro.precioMax)
                    .filter((a: Alojamiento) => (filtro.servicios ?? []).every((s: string) => a.servicios.includes(s)))
            )
        )
    }
}
