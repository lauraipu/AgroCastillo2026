import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {
  InvestigadorPublico,
  InvestigadorPublicoService
} from '../../services/investigador-publico.service';

@Component({
  selector: 'app-investigadores',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './investigadores.component.html',
  styleUrls: ['./investigadores.component.css']
})
export class InvestigadoresComponent implements OnInit {

  cargando = signal<boolean>(false);
  error = signal<string>('');

  terminoBusqueda = signal<string>('');
  lineaSeleccionada = signal<string>('Todas');

  investigadores = signal<InvestigadorPublico[]>([]);

  lineasEnfoque = [
    'Todas',
    'Investigación agroindustrial',
    'Software académico',
    'Agroindustria',
    'Investigación aplicada'
  ];

  investigadoresFiltrados = computed(() => {
    const busqueda = this.terminoBusqueda().toLowerCase().trim();
    const linea = this.lineaSeleccionada();

    return this.investigadores().filter(investigador => {
      const coincideLinea =
        linea === 'Todas' ||
        investigador.lineaEnfoque === linea ||
        investigador.palabrasClave.includes(linea);

      const textoPalabrasClave = investigador.palabrasClave
        .join(' ')
        .toLowerCase();

      const coincideBusqueda =
        !busqueda ||
        investigador.nombre.toLowerCase().includes(busqueda) ||
        investigador.correo.toLowerCase().includes(busqueda) ||
        investigador.rol.toLowerCase().includes(busqueda) ||
        investigador.institucion.toLowerCase().includes(busqueda) ||
        investigador.lineaEnfoque.toLowerCase().includes(busqueda) ||
        textoPalabrasClave.includes(busqueda);

      return coincideLinea && coincideBusqueda;
    });
  });

  constructor(
    private readonly investigadorPublicoService: InvestigadorPublicoService
  ) {}

  ngOnInit(): void {
    this.cargarInvestigadores();
  }

  cargarInvestigadores(): void {
    this.cargando.set(true);
    this.error.set('');

    this.investigadorPublicoService.listar().subscribe({
      next: (data: InvestigadorPublico[]) => {
        this.investigadores.set(data);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando investigadores:', err);
        this.error.set('No se pudieron cargar los investigadores desde la base de datos.');
        this.cargando.set(false);
      }
    });
  }

  actualizarBusqueda(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  seleccionarLinea(linea: string): void {
    this.lineaSeleccionada.set(linea);
  }

  limpiarFiltros(): void {
    this.terminoBusqueda.set('');
    this.lineaSeleccionada.set('Todas');
  }

  obtenerInicial(nombre: string): string {
    if (!nombre || !nombre.trim()) {
      return 'I';
    }

    return nombre.trim().charAt(0).toUpperCase();
  }

  verPerfilPublico(investigador: InvestigadorPublico): void {
    alert(
      `Perfil de ${investigador.nombre}\n\n` +
      `Correo: ${investigador.correo}\n` +
      `Institución: ${investigador.institucion}\n` +
      `Línea de enfoque: ${investigador.lineaEnfoque}`
    );
  }
}