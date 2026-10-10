import {ChangeDetectorRef, Component, inject, Input, OnInit} from "@angular/core";
import {Reserva} from "../../model/reservamodel";
import {Alojamientoservice} from "../../services/alojamientoservice";
import {Alojamiento} from "../../model/alojamientomodel";

@Component({
  selector: "app-reservaitemcomponent",
  standalone: false,
  styleUrl: "./reservaitemcomponent.css",
  templateUrl: "./reservaitemcomponent.html",
})
export class Reservaitemcomponent implements OnInit {
    @Input({required: true}) reserva? :Reserva;
    private alojamientoService :Alojamientoservice = inject(Alojamientoservice);
    alojamiento? :Alojamiento;
    cdr :ChangeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit() {
        if(this.reserva){
            this.alojamientoService.getAlojamientoById(this.reserva.idAlojamiento).subscribe((a? :Alojamiento) => {
                this.alojamiento = a;
                this.cdr.markForCheck();
            })
        }
    }
}
