import { Component } from '@angular/core';

@Component({
  selector: 'app-footercomponent',
  standalone: false,
  templateUrl: './footercomponent.html',
  styleUrl: './footercomponent.css'
})
export class Footercomponent {
  readonly anio = new Date().getFullYear();
}
