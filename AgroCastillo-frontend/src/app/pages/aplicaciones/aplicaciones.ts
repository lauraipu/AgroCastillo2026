import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AplicacionCatalogoService,
  HerramientaCatalogo
} from '../../services/aplicacion-catalogo.service';

@Component({
  selector: 'app-aplicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aplicaciones.html',
  styleUrls: ['./aplicaciones.css']
})
export class AplicacionesComponent implements OnInit {

  cargando = signal<boolean>(false);
  error = signal<string>('');

  sectorSeleccionado = signal<string>('Todas');
  subcategoriaActiva = signal<string>('Todas');
  terminoBusqueda = signal<string>('');

  herramientas = signal<HerramientaCatalogo[]>([]);

  sectores = computed(() => {
    const sectoresBase = this.herramientas()
      .map(herramienta => herramienta.sector)
      .filter(sector => !!sector && sector.trim() !== '');

    return ['Todas', ...Array.from(new Set(sectoresBase))];
  });

  subcategoriasDisponibles = computed(() => {
    const sector = this.sectorSeleccionado();

    const herramientasFiltradasPorSector = this.herramientas()
      .filter(herramienta => {
        return sector === 'Todas' || herramienta.sector === sector;
      });

    const subcategorias = herramientasFiltradasPorSector
      .flatMap(herramienta => {
        if (herramienta.categorias && herramienta.categorias.length > 0) {
          return herramienta.categorias;
        }

        return [herramienta.subcategoria];
      })
      .filter(subcategoria => !!subcategoria && subcategoria.trim() !== '');

    return Array.from(new Set(subcategorias));
  });

  herramientasFiltradas = computed(() => {
    const sector = this.sectorSeleccionado();
    const subcategoria = this.subcategoriaActiva();
    const busqueda = this.terminoBusqueda().toLowerCase().trim();

    return this.herramientas().filter(herramienta => {
      const coincideSector =
        sector === 'Todas' ||
        herramienta.sector === sector;

      const categorias = herramienta.categorias && herramienta.categorias.length > 0
        ? herramienta.categorias
        : [herramienta.subcategoria];

      const coincideSubcategoria =
        subcategoria === 'Todas' ||
        categorias.includes(subcategoria) ||
        herramienta.subcategoria === subcategoria;

      const textoCategorias = categorias.join(' ').toLowerCase();

      const coincideBusqueda =
        !busqueda ||
        herramienta.nombre.toLowerCase().includes(busqueda) ||
        herramienta.descripcion.toLowerCase().includes(busqueda) ||
        herramienta.investigadorPrincipal.toLowerCase().includes(busqueda) ||
        herramienta.codigo.toLowerCase().includes(busqueda) ||
        textoCategorias.includes(busqueda);

      return coincideSector && coincideSubcategoria && coincideBusqueda;
    });
  });

  constructor(
    private readonly aplicacionCatalogoService: AplicacionCatalogoService
  ) {}

  ngOnInit(): void {
    this.cargarAplicaciones();
  }

  cargarAplicaciones(): void {
    this.cargando.set(true);
    this.error.set('');

    this.aplicacionCatalogoService.listar().subscribe({
      next: (data: HerramientaCatalogo[]) => {
        this.herramientas.set(data);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando aplicaciones del catálogo:', err);
        this.error.set('No se pudieron cargar las aplicaciones desde la base de datos.');
        this.cargando.set(false);
      }
    });
  }

  seleccionarSector(sector: string): void {
    this.sectorSeleccionado.set(sector);
    this.subcategoriaActiva.set('Todas');
  }

  seleccionarSubcategoria(subcategoria: string): void {
    this.subcategoriaActiva.set(subcategoria);
  }

  actualizarBusqueda(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  limpiarFiltros(): void {
    this.sectorSeleccionado.set('Todas');
    this.subcategoriaActiva.set('Todas');
    this.terminoBusqueda.set('');
  }

  accederHerramienta(herramienta: HerramientaCatalogo): void {
    if (herramienta.urlAplicacion && herramienta.urlAplicacion.trim() !== '') {
      window.open(herramienta.urlAplicacion, '_blank', 'noopener,noreferrer');
      return;
    }

    alert('Esta aplicación todavía no tiene un enlace de acceso registrado.');
  }
}