import {ChangeDetectorRef, Component, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Alojamiento} from "../../model/alojamientomodel";
import {Alojamientoservice} from "../../services/alojamientoservice";

@Component({
  selector: "app-alojamientopagecomponent",
  standalone: false,
  styleUrl: "./alojamientopagecomponent.css",
  templateUrl: "./alojamientopagecomponent.html",
})
export class Alojamientopagecomponent {
    alojamientoId: string = "1";
    alojamiento? :Alojamiento;
    alojamientoService : Alojamientoservice = inject(Alojamientoservice)

    rutaActiva :ActivatedRoute = inject(ActivatedRoute);
    cdr :ChangeDetectorRef = inject(ChangeDetectorRef);
    alojamientoExiste:boolean = true;

    ngOnInit() {
        this.rutaActiva.params.subscribe(params => {
            this.alojamientoId = params['id'];
            this.alojamientoService.getAlojamientoById(parseInt(this.alojamientoId)).subscribe((data?: Alojamiento) => {
                this.alojamiento = data;
                if(this.alojamiento != undefined){
                    this.alojamientoExiste=true;
                    this.cdr.markForCheck();
                }
                else {
                    this.alojamientoExiste = false;
                    this.cdr.markForCheck();
                }
            })
        })
    }
}
