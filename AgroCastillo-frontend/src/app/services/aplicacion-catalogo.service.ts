import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface HerramientaCatalogo {
  id: number;
  codigo: string;
  nombre: string;
  sector: string;
  subcategoria: string;
  descripcion: string;
  investigadorPrincipal: string;
  version: string;
  trl: number;
  consultas: number;
  urlAplicacion: string | null;
  categorias: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AplicacionCatalogoService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:8443/api/aplicaciones';

  listar(): Observable<HerramientaCatalogo[]> {
    return this.http.get<HerramientaCatalogo[]>(this.apiUrl);
  }
}