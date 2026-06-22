import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface HiloDiscusion {
  idHilo?: number;
  titulo: string;
  contenido: string;
  idUsuario: number;
  fechaCreacion?: string;
}

export interface ComentarioHilo {
  idComentario?: number;
  contenido: string;
  idUsuario: number;
  idHilo?: number;
  fechaComentario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = 'https://localhost:8443/api/comunidad';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  listarHilos(): Observable<HiloDiscusion[]> {
    return this.http.get<HiloDiscusion[]>(`${this.apiUrl}/hilos`);
  }

  obtenerHiloPorId(idHilo: number): Observable<HiloDiscusion> {
    return this.http.get<HiloDiscusion>(`${this.apiUrl}/hilos/${idHilo}`);
  }

  crearHilo(hilo: HiloDiscusion): Observable<HiloDiscusion> {
    // Requiere token obligatorio en el backend
    return this.http.post<HiloDiscusion>(`${this.apiUrl}/hilos`, hilo, { headers: this.getHeaders() });
  }

  listarComentariosPorHilo(idHilo: number): Observable<ComentarioHilo[]> {
    return this.http.get<ComentarioHilo[]>(`${this.apiUrl}/hilos/${idHilo}/comentarios`);
  }

  agregarComentario(idHilo: number, comentario: ComentarioHilo): Observable<ComentarioHilo> {
    // Requiere token obligatorio en el backend
    return this.http.post<ComentarioHilo>(
      `${this.apiUrl}/hilos/${idHilo}/comentarios`, 
      comentario, 
      { headers: this.getHeaders() }
    );
  }
}