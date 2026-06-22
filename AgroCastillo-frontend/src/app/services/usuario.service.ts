import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface PerfilUsuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fechaRegistro?: string;
  activo?: boolean;
}

export interface ActualizarUsuarioPayload {
  nombre: string;
  email: string;
}

export interface CambiarPasswordPayload {
  passwordActual: string;
  passwordNueva: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Apunta a las rutas protegidas definidas en tu SecurityConfig del backend
  private readonly API_URL = 'https://localhost:8443/api/usuarios';

  /**
   * Genera de forma dinámica las cabeceras con el Token JWT requerido por el backend
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Obtiene los detalles del perfil del usuario autenticado actualmente
   */
  obtenerPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.API_URL}/perfil`, { 
      headers: this.getHeaders() 
    });
  }

  /**
   * Actualiza los datos básicos (nombre, email) del usuario
   */
  actualizarPerfil(payload: ActualizarUsuarioPayload): Observable<PerfilUsuario> {
    return this.http.put<PerfilUsuario>(`${this.API_URL}/perfil`, payload, { 
      headers: this.getHeaders() 
    });
  }

  /**
   * Cambia la contraseña del usuario validando la anterior desde el ecosistema seguro
   */
  cambiarPassword(payload: CambiarPasswordPayload): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/perfil/cambiar-password`, payload, { 
      headers: this.getHeaders() 
    });
  }

  /**
   * Permite al propio usuario solicitar la baja o desactivación de su cuenta
   */
  desactivarMiCuenta(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/perfil`, { 
      headers: this.getHeaders() 
    });
  }
}