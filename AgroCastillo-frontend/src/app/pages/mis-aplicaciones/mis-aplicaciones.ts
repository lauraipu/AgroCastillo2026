import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AplicacionInvestigador,
  AplicacionPayload,
  MisAplicacionesService
} from '../../services/mis-aplicaciones.service';

@Component({
  selector: 'app-mis-aplicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-aplicaciones.html',
  styleUrls: ['./mis-aplicaciones.css']
})
export class MisAplicacionesComponent implements OnInit {

  aplicaciones = signal<AplicacionInvestigador[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string>('');

  modalAbierto = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);
  aplicacionEditando = signal<AplicacionInvestigador | null>(null);

  formulario: AplicacionPayload = {
    nombre: '',
    descripcion: '',
    urlAplicacion: ''
  };

  totalAplicaciones = computed(() => this.aplicaciones().length);

  totalDescargas = computed(() => 0);

  promedioGeneral = computed(() => '0.0');

  constructor(
    private readonly misAplicacionesService: MisAplicacionesService
  ) {}

  ngOnInit(): void {
    this.cargarAplicaciones();
  }

  cargarAplicaciones(): void {
    this.cargando.set(true);
    this.error.set('');

    this.misAplicacionesService.listar().subscribe({
      next: (data: AplicacionInvestigador[]) => {
        this.aplicaciones.set(data);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando aplicaciones:', err);
        this.error.set('No se pudieron cargar las aplicaciones desde la base de datos.');
        this.cargando.set(false);
      }
    });
  }

  registrarNuevaAplicacion(): void {
    this.modoEdicion.set(false);
    this.aplicacionEditando.set(null);

    this.formulario = {
      nombre: '',
      descripcion: '',
      urlAplicacion: ''
    };

    this.modalAbierto.set(true);
  }

  editarFicha(aplicacion: AplicacionInvestigador): void {
    this.modoEdicion.set(true);
    this.aplicacionEditando.set(aplicacion);

    this.formulario = {
      nombre: aplicacion.nombre,
      descripcion: aplicacion.descripcion,
      urlAplicacion: aplicacion.urlAplicacion || ''
    };

    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.modoEdicion.set(false);
    this.aplicacionEditando.set(null);

    this.formulario = {
      nombre: '',
      descripcion: '',
      urlAplicacion: ''
    };
  }

  guardarAplicacion(): void {
    if (!this.formulario.nombre.trim()) {
      alert('El nombre de la aplicación es obligatorio.');
      return;
    }

    if (!this.formulario.descripcion.trim()) {
      alert('La descripción es obligatoria.');
      return;
    }

    const payload: AplicacionPayload = {
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion.trim(),
      urlAplicacion: this.formulario.urlAplicacion.trim()
    };

    if (this.modoEdicion()) {
      const app = this.aplicacionEditando();

      if (!app) {
        alert('No se encontró la aplicación que deseas editar.');
        return;
      }

      this.misAplicacionesService.actualizar(app.id, payload).subscribe({
        next: (_data: AplicacionInvestigador) => {
          this.cerrarModal();
          this.cargarAplicaciones();
          alert('Aplicación actualizada correctamente.');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error actualizando aplicación:', err);
          alert('No se pudo actualizar la aplicación.');
        }
      });

      return;
    }

    this.misAplicacionesService.crear(payload).subscribe({
      next: (_data: AplicacionInvestigador) => {
        this.cerrarModal();
        this.cargarAplicaciones();
        alert('Aplicación registrada correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creando aplicación:', err);
        alert('No se pudo registrar la aplicación.');
      }
    });
  }

  eliminarRegistro(idAplicacion: number): void {
    const confirmar = confirm('¿Seguro que deseas eliminar esta aplicación?');

    if (!confirmar) {
      return;
    }

    this.misAplicacionesService.eliminar(idAplicacion).subscribe({
      next: () => {
        this.cargarAplicaciones();
        alert('Aplicación eliminada correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error eliminando aplicación:', err);
        alert('No se pudo eliminar la aplicación.');
      }
    });
  }

  verDocumentacion(aplicacion: AplicacionInvestigador): void {
    alert(
      `Documentación de ${aplicacion.nombre}\n\n` +
      `Esta sección queda lista para conectar con la tabla documentacion.\n` +
      `URL registrada: ${aplicacion.urlAplicacion || 'No registrada'}`
    );
  }

  verEstadisticas(aplicacion: AplicacionInvestigador): void {
    alert(
      `Estadísticas de ${aplicacion.nombre}\n\n` +
      `Esta sección queda lista para conectar con estadisticas_descargas, calificaciones y favoritos.`
    );
  }

  traducirEstado(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'Activo';

      case 'inactivo':
        return 'Inactivo';

      case 'eliminado':
        return 'Eliminado';

      case 'APROBADO':
        return 'Aprobado';

      case 'EN_REVISION':
        return 'En revisión';

      case 'RECHAZADO':
        return 'Rechazado';

      default:
        return estado || 'Activo';
    }
  }

  claseEstado(estado: string): string {
    switch (estado) {
      case 'activo':
      case 'APROBADO':
        return 'approved';

      case 'inactivo':
      case 'EN_REVISION':
        return 'review';

      case 'eliminado':
      case 'RECHAZADO':
        return 'rejected';

      default:
        return 'approved';
    }
  }

  obtenerCodigo(aplicacion: AplicacionInvestigador): string {
    return `APP-${aplicacion.id}`;
  }

  obtenerFecha(fecha: string): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}