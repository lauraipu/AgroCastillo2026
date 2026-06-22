import { Component } from '@angular/core';

@Component({
  selector: 'app-detalle-aplicacion',
  standalone: true,
  imports: [],
  templateUrl: './detalle-aplicacion.html',
  styleUrls: ['./detalle-aplicacion.css']
})
export class DetalleAplicacionComponent {
  abrirHerramienta(url: string): void {
    window.open(url, '_blank');
  }
}
