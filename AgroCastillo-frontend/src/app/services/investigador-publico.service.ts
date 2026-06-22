import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface InvestigadorPublico {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  institucion: string;
  lineaEnfoque: string;
  cvlacUrl: string;
  orcid: string | null;
  palabrasClave: string[];
}

@Injectable({
  providedIn: 'root'
})
export class InvestigadorPublicoService {

  private readonly apiUrl = 'https://localhost:8443/api/investigadores';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<InvestigadorPublico[]> {
    return this.http.get<InvestigadorPublico[]>(this.apiUrl);
  }
}