import {ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {ReservaService} from "../../services/reservaservice";
import {Cotizacion} from "../../model/cotizacionmodel";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {AutenticacionService, SesionUsuario} from "../../services/autenticacion-service";
import {Alojamiento} from "../../model/alojamientomodel";
import {filter, switchMap, take, tap} from "rxjs";
import {Alojamientoservice} from "../../services/alojamientoservice";

@Component({
  selector: "app-confirmarreservacomponent",
  standalone: false,
  styleUrl: "./confirmarreservacomponent.css",
  templateUrl: "./confirmarreservacomponent.html",
})
export class Confirmarreservacomponent implements OnInit{
    private cdr :ChangeDetectorRef = inject(ChangeDetectorRef);
    private reservaService :ReservaService = inject(ReservaService);
    private authService :AutenticacionService = inject(AutenticacionService);
    private alojamientoService :Alojamientoservice = inject(Alojamientoservice);

    router :Router = inject(Router);
    private formBuilder = inject(FormBuilder);

    form =this.formBuilder.nonNullable.group({
        userId: [{value: '', disabled: true}],
        userName: ['', Validators.required],
        email: [{value: '', disabled: true}],
        idAlojamiento: [{value: 0, disabled: true}],
        fechaLlegada: [{value: '', disabled: true}],
        fechaSalida: [{value: '', disabled: true}],
        numeroHuespedes: [{value:0, disabled: true}],
        numeroNoches: [{value:0, disabled: true}],
        precioTotal: [{value:0, disabled: true}],
        estado: [{value:"En proceso", disabled: true}],
        nombreAlojamiento: [{value:"", disabled: true}],
        ciudad: [{value:"", disabled: true}],
    })

    alojamiento?:Alojamiento;
    cotizacion:Cotizacion | null = null;

    ngOnInit(): void {
        this.reservaService.getCotizacionPendiente().pipe(
            take(1),
            tap(cotizacion => {
                if (!cotizacion) this.router.navigate(['/']);
            }),
            filter((cotizacion): cotizacion is Cotizacion => cotizacion !== null),
            tap(cotizacion => this.cotizacion = cotizacion),
            switchMap(cotizacion =>
                this.alojamientoService.getAlojamientoById(cotizacion.alojamientoId)
            )
        ).subscribe(alojamiento => {
            this.alojamiento = alojamiento;
            this.cargarDatos();
        });
    }

    private cargarDatos(){
        const usuario = this.authService.obtenerSesion();
        if(this.cotizacion && this.alojamiento && usuario) {
            this.form.patchValue({
                userId: usuario.uid,
                email: usuario.email,
                idAlojamiento: this.cotizacion.alojamientoId,
                fechaLlegada: this.cotizacion.fechaLlegada,
                fechaSalida: this.cotizacion.fechaSalida,
                numeroHuespedes: this.cotizacion.numeroHuespedes,
                numeroNoches: this.cotizacion.numeroNoches,
                precioTotal: this.cotizacion.total,
                nombreAlojamiento: this.alojamiento.nombre,
                ciudad: this.alojamiento.ciudad
            })
            this.cdr.markForCheck();
        }
    }

    reservar(){
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const confirmada = this.reservaService.agregarReserva(this.form.controls.userName.value);

        if(confirmada){
            console.log("Funcionó crack "+ this.form.controls.userName.value);
            this.router.navigate(['/mis-reservas']);
        } else {
            console.log("El problema llegó hasta aquí ._.")
        }
    }

}
