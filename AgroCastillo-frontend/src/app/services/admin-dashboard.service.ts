import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface AdminStats {
  totalUsuarios: number;
  totalAplicaciones: number;
  totalHilos: number;
  totalComentarios: number;
}

export interface AdminUsuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}

export interface AdminHilo {
  id: number;
  titulo: string;
  contenido: string;
  idUsuario: number;
  fechaCreacion: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly adminUrl = 'https://localhost:8443/api/admin/dashboard';
  private readonly aplicacionesUrl = 'https://localhost:8443/api/aplicaciones';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  obtenerStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.adminUrl}/stats`, { headers: this.getHeaders() });
  }

  listarUsuarios(): Observable<AdminUsuario[]> {
    return this.http.get<AdminUsuario[]>(`${this.adminUrl}/usuarios`, { headers: this.getHeaders() });
  }

  alternarEstadoUsuario(id: number): Observable<AdminUsuario> {
    return this.http.patch<AdminUsuario>(`${this.adminUrl}/usuarios/${id}/estado`, {}, { headers: this.getHeaders() });
  }

  cambiarRolUsuario(id: number, rol: string): Observable<AdminUsuario> {
    return this.http.patch<AdminUsuario>(
      `${this.adminUrl}/usuarios/${id}/rol?rol=${rol}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  listarHilos(): Observable<AdminHilo[]> {
    return this.http.get<AdminHilo[]>(`${this.adminUrl}/hilos`, { headers: this.getHeaders() });
  }

  cambiarEstadoHilo(id: number, estado: string): Observable<AdminHilo> {
    return this.http.patch<AdminHilo>(
      `${this.adminUrl}/hilos/${id}/estado?estado=${estado}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  listarAplicaciones(): Observable<any[]> {
    // Esta ruta es pública según SecurityConfig (.permitAll), no necesita headers obligatorios
    return this.http.get<any[]>(this.aplicacionesUrl);
  }
}