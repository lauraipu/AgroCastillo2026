import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InicioStats {
  investigadores: number;
  aplicaciones: number;
  hilos: number;
  lineas: number;
}

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  private apiUrl = 'https://localhost:8443/api/inicio';

  constructor(private http: HttpClient) {}

  obtenerEstadisticas(): Observable<InicioStats> {
    return this.http.get<InicioStats>(`${this.apiUrl}/stats`);
  }
}