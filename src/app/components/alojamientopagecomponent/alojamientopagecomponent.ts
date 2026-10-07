import {Component, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-alojamientopagecomponent",
  standalone: false,
  styleUrl: "./alojamientopagecomponent.css",
  templateUrl: "./alojamientopagecomponent.html",
})
export class Alojamientopagecomponent {
    alojamientoId: number = 5;

    rutaActiva :ActivatedRoute = inject(ActivatedRoute);

    ngOnInit() {
        this.rutaActiva.params.subscribe(params => {
            this.alojamientoId = params['id'];
        })
    }
}
