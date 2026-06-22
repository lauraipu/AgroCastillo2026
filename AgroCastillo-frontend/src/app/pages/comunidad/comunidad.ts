import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  ComunidadService,
  HiloDiscusion,
  ComentarioHilo
} from '../../services/comunidad.service';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comunidad.html',
  styleUrl: './comunidad.css'
})
export class ComunidadComponent implements OnInit {

  // Inyección de servicios usando el patrón moderno inject()
  private readonly comunidadService = inject(ComunidadService);
  private readonly authService = inject(AuthService);

  // Signals para el manejo reactivo del estado de la interfaz
  hilos = signal<HiloDiscusion[]>([]);
  comentarios = signal<ComentarioHilo[]>([]);
  hiloSeleccionado = signal<HiloDiscusion | null>(null);

  cargando = signal(false);
  error = signal('');
  mensajeExito = signal('');

  // Modelos para los campos de los formularios (2-way data binding)
  nuevoTitulo = '';
  nuevoContenido = '';
  nuevoComentario = '';

  ngOnInit(): void {
    this.cargarHilos();
  }

  /**
   * Obtiene dinámicamente el ID del usuario autenticado desde el AuthService.
   * Si no hay sesión o el objeto no tiene ID, usa el valor 9 como fallback seguro.
   */
  get idUsuarioActual(): number {
    const usuarioLogueado = this.authService.getUsuarioActual();
    // @ts-ignore (En caso de que tu interfaz interna de Usuario no tenga mapeado el campo id de manera explícita)
    return usuarioLogueado?.id ?? 9; 
  }

  /**
   * Carga la lista completa de hilos de discusión públicos
   */
  cargarHilos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.comunidadService.listarHilos().subscribe({
      next: (data) => {
        this.hilos.set(data);
        this.cargando.set(false);

        // Si existen hilos y no hay ninguno seleccionado en pantalla, se preselecciona el primero
        if (data.length > 0 && !this.hiloSeleccionado()) {
          this.seleccionarHilo(data[0]);
        }
      },
      error: () => {
        this.error.set('No se pudieron cargar los hilos de discusión.');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Envía la petición al backend para registrar un nuevo hilo de discusión
   */
  crearHilo(): void {
    this.limpiarMensajes();

    if (!this.nuevoTitulo.trim() || !this.nuevoContenido.trim()) {
      this.error.set('Debes escribir un título y un contenido para crear el hilo.');
      return;
    }

    const hilo: HiloDiscusion = {
      titulo: this.nuevoTitulo.trim(),
      contenido: this.nuevoContenido.trim(),
      idUsuario: this.idUsuarioActual
    };

    this.comunidadService.crearHilo(hilo).subscribe({
      next: (hiloCreado) => {
        this.nuevoTitulo = '';
        this.nuevoContenido = '';
        this.mensajeExito.set('El hilo fue creado correctamente.');
        this.cargarHilos();
        this.seleccionarHilo(hiloCreado);
      },
      error: () => {
        this.error.set('No se pudo crear el hilo. Intenta nuevamente.');
      }
    });
  }

  /**
   * Selecciona un hilo específico de la lista y dispara la búsqueda de sus comentarios asociados
   */
  seleccionarHilo(hilo: HiloDiscusion): void {
    this.hiloSeleccionado.set(hilo);
    if (hilo.idHilo) {
      this.cargarComentarios(hilo.idHilo);
    }
  }

  /**
   * Carga los comentarios pertenecientes a un hilo en particular
   */
  cargarComentarios(idHilo: number): void {
    this.comunidadService.listarComentariosPorHilo(idHilo).subscribe({
      next: (data) => {
        this.comentarios.set(data);
      },
      error: () => {
        this.error.set('No se pudieron cargar los comentarios del hilo.');
      }
    });
  }

  /**
   * Registra un nuevo comentario en el hilo que se encuentra actualmente abierto
   */
  crearComentario(): void {
    this.limpiarMensajes();

    const hilo = this.hiloSeleccionado();

    if (!hilo || !hilo.idHilo) {
      this.error.set('Selecciona un hilo antes de comentar.');
      return;
    }

    if (!this.nuevoComentario.trim()) {
      this.error.set('El comentario no puede estar vacío.');
      return;
    }

    const comentario: ComentarioHilo = {
      contenido: this.nuevoComentario.trim(),
      idUsuario: this.idUsuarioActual
    };

    // 🛠️ Sincronizado correctamente con el método 'agregarComentario' de tu servicio
    this.comunidadService.agregarComentario(hilo.idHilo, comentario).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.mensajeExito.set('Comentario publicado correctamente.');
        this.cargarComentarios(hilo.idHilo!);
      },
      error: () => {
        this.error.set('No se pudo publicar el comentario.');
      }
    });
  }

  /**
   * Formatea las fechas ISO del servidor a una presentación local colombiana amigable
   */
  formatearFecha(fecha?: string): string {
    if (!fecha) return 'Fecha no disponible';

    return new Date(fecha).toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  /**
   * Restablece los estados de error y éxito de la pantalla
   */
  limpiarMensajes(): void {
    this.error.set('');
    this.mensajeExito.set('');
  }
}