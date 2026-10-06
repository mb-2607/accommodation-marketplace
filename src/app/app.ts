import {Component, inject, signal} from '@angular/core';
import {Alojamientoservice} from "./services/alojamientoservice";

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('lralojamiento');
    as :Alojamientoservice  = inject(Alojamientoservice);
    ngOnInit(): void {
        this.as.getAlojamientos().subscribe(data =>{
            console.log(data);
        })

        this.as.getAlojamientoById(1).subscribe(data =>{
            console.log(data);
        })

        this.as.getAlojamientosByContains("partamento").subscribe(data =>{
            console.log(data);
        })

        this.as.getAlojamientosByFilter({
            servicios:["Wi-Fi", "Parqueadero"]
        }).subscribe(data =>{
            console.log(data);
        })
  }
}
