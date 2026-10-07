import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resena} from "../model/resenamodel";
import {map, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ResenaService {
    private cliente :HttpClient = inject(HttpClient) as HttpClient;
    private readonly URL_BASE :string = 'assets/data/';

    getResenas() :Observable<Resena[]> {
        return this.cliente.get<Resena[]>(this.URL_BASE+'resenas.json');
    }

    getResenasByAlojamientoId(alojamientoId:number) :Observable<Resena[]>{
        return this.getResenas().pipe(
            map((resenas: Resena[]) => resenas.filter((r :Resena) => r.alojamientoId === alojamientoId))
        )
    }
}
