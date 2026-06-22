import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';
import { AccesibilidadService } from './services/accesibilidad.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.html',
  
})
export class AppComponent {

  private readonly accesibilidad =
    inject(AccesibilidadService);

}