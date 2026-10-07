import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbarcomponent',
  standalone: false,
  templateUrl: './navbarcomponent.html',
  styleUrl: './navbarcomponent.css',
})
export class Navbarcomponent {
  nombretienda = 'Inversiones LR';
  terminoBusqueda = '';

  constructor(private router: Router) {
  }

  buscar(): void {
    const termino = this.terminoBusqueda.trim();

    this.router.navigate(['/alojamientos'], {
      queryParams: termino ? {q: termino} : {}
    });
  }
}
