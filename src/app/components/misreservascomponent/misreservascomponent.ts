import {Component, inject, OnInit} from "@angular/core";
import {Reserva} from "../../model/reservamodel";
import {ReservaService} from "../../services/reservaservice";
import {AutenticacionService} from "../../services/autenticacion-service";
import {map} from "rxjs";

@Component({
  selector: "app-misreservascomponent",
  standalone: false,
  styleUrl: "./misreservascomponent.css",
  templateUrl: "./misreservascomponent.html",
})
export class Misreservascomponent implements OnInit {
    listaReservas :Reserva[] = []
    private reservaService : ReservaService = inject(ReservaService)
    private authService :AutenticacionService = inject(AutenticacionService)
    usuarioActivo :boolean = true;

    ngOnInit() {
        let usuario = this.authService.obtenerSesion()
        if(usuario){
            this.reservaService.getListaReservas().pipe(
                map((lista :Reserva[]) => lista.filter((r :Reserva) => r.userId == usuario.uid))
            ).subscribe((lista :Reserva[]) => {
                this.listaReservas = lista;
            });
        } else {
            this.usuarioActivo = false;
        }
    }

}
