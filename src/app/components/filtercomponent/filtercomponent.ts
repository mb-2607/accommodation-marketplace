import {ChangeDetectorRef, Component, DestroyRef, inject} from "@angular/core";
import {Alojamiento, TipoAlojamiento} from "../../model/alojamientomodel";
import {FiltroAlojamiento} from "../../model/filtroalojamientomodel";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, filter, map, Observable, startWith, switchMap} from "rxjs";
import {Alojamientoservice} from "../../services/alojamientoservice";

@Component({
  selector: "app-filtercomponent",
  standalone: false,
  styleUrl: "./filtercomponent.css",
  templateUrl: "./filtercomponent.html",
})
export class Filtercomponent {
    cdr:ChangeDetectorRef = inject(ChangeDetectorRef);
    alojamientoService :Alojamientoservice = inject(Alojamientoservice);
    readonly LISTA_SERVICIOS = ["Wi-Fi", "Cocina", "Parqueadero", "Televisión", "Lavadora", "Piscina",
    "Aire acondicionado", "BBQ", "Chimenea", "Gimnasio"];

    private destroyRef = inject(DestroyRef);
    listaAlojamiento?:Alojamiento[];

    filtro :FiltroAlojamiento = {};

    form = new FormGroup({
        usarPrecioMin: new FormControl(false, { nonNullable: true }),
        precioMin: new FormControl({value: 0, disabled: true}, { nonNullable: true }),

        usarPrecioMax: new FormControl(false, { nonNullable: true }),
        precioMax: new FormControl({value: 4000000, disabled: true}, { nonNullable: true }),

        usarHuespedes: new FormControl(false, { nonNullable: true }),
        numeroHuespedes: new FormControl({value: 1, disabled: true}, { nonNullable: true }),

        tipo: new FormControl<TipoAlojamiento | ''>('', { nonNullable: true }),
        ciudad: new FormControl('', { nonNullable: true }),
        departamento: new FormControl('', { nonNullable: true }),

        servicios: new FormArray(this.LISTA_SERVICIOS.map(() => new FormControl(false, { nonNullable: true })))
    });

    tipos: TipoAlojamiento[] = ['Apartamento', 'Casa', 'Cabaña'];
    readonly MAX_HUESPEDES = 10;

    cambiarHuespedes(delta: number): void {
        const control = this.form.controls.numeroHuespedes;
        const nuevo = control.value + delta;
        if (nuevo >= 1 && nuevo <= this.MAX_HUESPEDES) control.setValue(nuevo);
    }

    private vincularToggle( toggle: FormControl<boolean>, valor: FormControl<number>): void
    {
        toggle.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(activo => {
                if (activo) valor.enable({ emitEvent: false });
                else valor.disable({ emitEvent: false });
            });
    }

    ngOnInit() {
        this.vincularToggle(this.form.controls.usarPrecioMin, this.form.controls.precioMin);
        this.vincularToggle(this.form.controls.usarPrecioMax, this.form.controls.precioMax);
        this.vincularToggle(this.form.controls.usarHuespedes, this.form.controls.numeroHuespedes);

        this.form.valueChanges
            .pipe(
                debounceTime(300),
                filter(() => this.form.valid),
                map(() => this.construirFiltro()),
                startWith({} as FiltroAlojamiento),
                switchMap((f :FiltroAlojamiento) => this.actualizarLista(f)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(lista => {
                this.listaAlojamiento = lista;
                this.cdr.markForCheck();
            });
    }

    private construirFiltro(): FiltroAlojamiento {
        const v = this.form.value;
        return {
            precioMin: v.precioMin,
            precioMax: v.precioMax,
            huespedes: v.numeroHuespedes,
            tipo: v.tipo || undefined,
            ciudad: v.ciudad || undefined,
            departamento: v.departamento || undefined,
            servicios: this.LISTA_SERVICIOS.filter((s,i)=>this.form.controls.servicios.value[i])
        };
    }

    private actualizarLista(filtro : FiltroAlojamiento) :Observable<Alojamiento[]> {
        return this.alojamientoService.getAlojamientosByFilter(filtro);
    }

    private crearServicioFormControl() : FormControl<boolean> {
        return new FormControl(true, { nonNullable: true })
    }
}
