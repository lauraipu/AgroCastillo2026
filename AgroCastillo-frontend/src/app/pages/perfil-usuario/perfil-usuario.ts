import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta según la estructura de tu proyecto

// Interfaces para tipar correctamente los datos
interface UsuarioPerfil {
  nombre: string;
  email: string;
  rol: string;
  provider?: string; // opcional, algunos objetos Usuario no incluyen provider
}

interface MetricaUsuario {
  label: string;
  valor: number;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-usuario.html',
  styleUrls: ['./perfil-usuario.css'] // Asegúrate de que coincida con tu archivo CSS/SCSS
})
export class PerfilUsuarioComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Señales (Signals) reactivas para el estado de la vista
  readonly usuario = signal<UsuarioPerfil | null>(null);
  readonly modoEdicion = signal<boolean>(false);

  // Propiedad vinculada al input mediante [(ngModel)]
  nombreEditable: string = '';

  // Datos mockeados / iniciales para las secciones del HTML
  readonly intereses: string[] = ['Agricultura de precisión', 'Sostenibilidad', 'Control de plagas', 'Biotech'];
  readonly metricas: MetricaUsuario[] = [
    { label: 'Consultas Realizadas', valor: 42 },
    { label: 'Aplicaciones Guardadas', valor: 7 },
    { label: 'Reportes Descargados', valor: 15 }
  ];

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  /**
   * Carga la información del usuario en sesión
   */
  private cargarDatosUsuario(): void {
    // Intentar obtener el usuario actual desde tu servicio de autenticación
    // Si tu AuthService expone un método o signal, puedes consumirlo aquí. Por ejemplo:
    const usuarioActual = this.authService.getUsuarioActual() || {
      nombre: 'Laura Castillo',
      email: 'laura@agrocastillo.com',
      rol: 'INVESTIGADOR',
      provider: 'Google'
    };

    this.usuario.set(usuarioActual);
    this.nombreEditable = usuarioActual.nombre;
  }

  /**
   * Genera la inicial del nombre del usuario para el avatar
   */
  obtenerInicial(nombre?: string): string {
    if (!nombre) return 'U';
    return nombre.trim().charAt(0).toUpperCase();
  }

  /**
   * Activa el modo de edición de campos
   */
  activarEdicion(): void {
    const usuarioActual = this.usuario();
    if (usuarioActual) {
      this.nombreEditable = usuarioActual.nombre;
    }
    this.modoEdicion.set(true);
  }

  /**
   * Cancela la edición y reestablece el valor original
   */
  cancelarEdicion(): void {
    const usuarioActual = this.usuario();
    if (usuarioActual) {
      this.nombreEditable = usuarioActual.nombre;
    }
    this.modoEdicion.set(false);
  }

  /**
   * Simula o realiza el envío de cambios al backend
   */
  guardarCambios(): void {
    const usuarioActual = this.usuario();
    if (!usuarioActual || !this.nombreEditable.trim()) return;

    // Clonamos y modificamos el usuario localmente con el nuevo nombre
    const usuarioActualizado: UsuarioPerfil = {
      ...usuarioActual,
      nombre: this.nombreEditable.trim()
    };

    // Opcional: Aquí harías tu llamada HTTP PUT/PATCH a tu backend. Ejemplo:
    // this.http.put('https://localhost:8080/api/usuarios/perfil', usuarioActualizado).subscribe(...)

    this.usuario.set(usuarioActualizado);
    this.modoEdicion.set(false);
  }
}