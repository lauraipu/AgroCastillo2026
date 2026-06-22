import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { AuthService } from './auth.service';

// ═══════════════════════════════════════════════════════════════════════════════
// ORIGINAL (Comentado): Este interfaz estaba incompleto
// export interface PerfilInvestigador {
//   id: number;
//   nombreCompleto: string;
//   correo: string;
//   institucion: string;
//   lineaEnfoque: string;
//   orcid: string;
//   cvlac: string;
//   competencias: any[];
// }
// ═══════════════════════════════════════════════════════════════════════════════

export interface PerfilInvestigador {
  id: number;
  nombreCompleto: string;
  correo: string;
  institucion: string;
  lineaEnfoque: string;
  orcid: string;
  cvlac: string;
  competencias: Competencia[];
  aplicaciones?: AplicacionInvestigador[];  // ✅ NUEVO: Vinculación con BD
  provider?: string;  // ✅ NUEVO: Proveedor OAuth
  rol?: string;  // ✅ NUEVO: Rol del usuario
}

export interface Competencia {
  nombre: string;
  porcentaje: number;
}

export interface AplicacionInvestigador {
  id: number;
  nombre: string;
  descripcion: string;
  urlAplicacion?: string;
}

export interface ActualizarPerfilInvestigadorPayload {
  id: number;
  nombre: string;
  email: string;
  orcid: string;
  cvlac?: string;
  institucion?: string;
  lineaEnfoque?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvestigadorService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // ✅ CORRECCIÓN: URL de API actualizada (sin duplicado /api)
  private readonly API_URL = 'https://localhost:8443/api/perfil-investigador';
  private readonly API_APLICACIONES = 'https://localhost:8443/api/investigador/aplicaciones';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Obtiene el perfil completo del investigador desde la BD
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/InvestigadorController.java
   */
  obtenerPerfil(): Observable<PerfilInvestigador> {
    return this.http.get<PerfilInvestigador>(`${this.API_URL}/perfil`, {
      headers: this.getHeaders()
    }).pipe(
      map(perfil => this.mapearPerfilDesdeBackend(perfil)),
      catchError((error) => {
        console.error('Error al obtener perfil del investigador:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene las aplicaciones del investigador desde la BD
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/AplicacionInvestigadorController.java
   */
  obtenerAplicacionesInvestigador(): Observable<AplicacionInvestigador[]> {
    return this.http.get<AplicacionInvestigador[]>(this.API_APLICACIONES, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener aplicaciones del investigador:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza el perfil del investigador en la BD
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/service/InvestigadorService.java
   */
  actualizarPerfil(payload: ActualizarPerfilInvestigadorPayload): Observable<PerfilInvestigador> {
    return this.http.put<PerfilInvestigador>(`${this.API_URL}/perfil/${payload.id}`, payload, {
      headers: this.getHeaders()
    }).pipe(
      map(perfil => this.mapearPerfilDesdeBackend(perfil)),
      catchError((error) => {
        console.error('Error al actualizar perfil del investigador:', error);
        throw error;
      })
    );
  }

  /**
   * Mapea la respuesta del backend al interfaz local
   * Normaliza campos que podrían venir en diferentes formatos desde Java
   */
  private mapearPerfilDesdeBackend(data: any): PerfilInvestigador {
    return {
      id: data?.id ?? 0,
      nombreCompleto: data?.nombreCompleto ?? data?.nombre ?? 'Investigador sin nombre',
      correo: data?.correo ?? data?.email ?? 'Sin correo',
      institucion: data?.institucion ?? 'No especificada',
      lineaEnfoque: data?.lineaEnfoque ?? 'Sin línea de enfoque',
      orcid: data?.orcid ?? '',
      cvlac: data?.cvlac ?? data?.cvlacUrl ?? '',
      competencias: Array.isArray(data?.competencias) ? data.competencias : [],
      aplicaciones: Array.isArray(data?.aplicaciones) ? data.aplicaciones : [],
      provider: data?.provider ?? 'LOCAL',
      rol: data?.rol ?? 'INVESTIGADOR'
    };
  }
}