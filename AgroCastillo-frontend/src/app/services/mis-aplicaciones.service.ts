import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

// ═══════════════════════════════════════════════════════════════════════════════
// ORIGINAL (Comentado):
// Estos interfaces eran incompletos y no reflejaban la estructura real de la BD
// export interface AplicacionInvestigador {
//   id: number;
//   nombre: string;
//   descripcion: string;
//   urlAplicacion: string;
//   idAutor: number;
//   estado: string;
//   fechaCreacion: string;
//   fechaActualizacion: string;
// }
//
// export interface AplicacionPayload {
//   nombre: string;
//   descripcion: string;
//   urlAplicacion: string;
// }
// ═══════════════════════════════════════════════════════════════════════════════

export interface AplicacionInvestigador {
  id: number;
  nombre: string;
  descripcion: string;
  urlAplicacion?: string;  // ✅ Opcional para casos sin URL
  idAutor?: number;
  estado?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  idApp?: number;  // ✅ Campo alternativo de la BD
  id_app?: number;  // ✅ Formato snake_case de BD
}

export interface AplicacionPayload {
  nombre: string;
  descripcion: string;
  urlAplicacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class MisAplicacionesService {

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // ✅ CORRECCIÓN: Usar ruta con /api y sin duplicados
  private readonly apiPrivada = 'https://localhost:8443/api/investigador/aplicaciones';
  // Fallback solo si la ruta privada no funciona
  private readonly apiCatalogo = 'https://localhost:8443/api/aplicaciones';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Lista las aplicaciones del investigador autenticado desde la BD
   * Conecta con: AplicacionInvestigadorController.listar()
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/AplicacionInvestigadorController.java:30
   */
  listar(): Observable<AplicacionInvestigador[]> {
    return this.http.get<any[]>(this.apiPrivada, { headers: this.getHeaders() }).pipe(
      map((data) => this.mapearAplicaciones(data)),
      catchError((error) => {
        console.warn('⚠️ No se pudo cargar desde la ruta privada protegida, intentando catálogo público alterno:', error);
        return this.http.get<any[]>(this.apiCatalogo).pipe(
          map((data) => this.mapearAplicaciones(data)),
          catchError((errorCatalogo) => {
            console.error('❌ Error definitivo en ambos extremos del catálogo:', errorCatalogo);
            return of([]);
          })
        );
      })
    );
  }

  /**
   * Crea una nueva aplicación para el investigador en la BD
   * Conecta con: AplicacionInvestigadorController.crear()
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/AplicacionInvestigadorController.java:41
   */
  crear(payload: AplicacionPayload): Observable<AplicacionInvestigador> {
    return this.http.post<any>(this.apiPrivada, payload, { headers: this.getHeaders() }).pipe(
      map((data) => this.mapearAplicacion(data)),
      catchError((error) => {
        console.error('❌ Error creando aplicación en la BD:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza una aplicación existente en la BD
   * Conecta con: AplicacionInvestigadorController.actualizar()
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/AplicacionInvestigadorController.java:53
   */
  actualizar(idAplicacion: number, payload: AplicacionPayload): Observable<AplicacionInvestigador> {
    return this.http.put<any>(
      `${this.apiPrivada}/${idAplicacion}`,
      payload,
      { headers: this.getHeaders() }
    ).pipe(
      map((data) => this.mapearAplicacion(data)),
      catchError((error) => {
        console.error('❌ Error actualizando aplicación en la BD:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina lógicamente una aplicación (marca como eliminada)
   * Conecta con: AplicacionInvestigadorController.eliminar()
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/AplicacionInvestigadorController.java:66
   */
  eliminar(idAplicacion: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPrivada}/${idAplicacion}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('❌ Error eliminando aplicación en la BD:', error);
        throw error;
      })
    );
  }

  /**
   * Mapea un array de aplicaciones desde la respuesta del backend
   * Normaliza diferentes formatos de campo
   */
  private mapearAplicaciones(data: any[]): AplicacionInvestigador[] {
    return (data ?? []).map((item, index) => this.mapearAplicacion(item, index));
  }

  /**
   * Mapea una única aplicación, normalizando campos que podrían venir
   * en diferentes formatos desde la BD (camelCase vs snake_case)
   */
  private mapearAplicacion(item: any, index = 0): AplicacionInvestigador {
    // Buscar el ID en múltiples formatos posibles
    const id = item?.id ?? item?.idApp ?? item?.id_app ?? item?.idAplicacion ?? index + 1;

    return {
      id,
      nombre: item?.nombre ?? item?.titulo ?? 'Aplicación sin nombre',
      descripcion: item?.descripcion ?? 'Sin descripción registrada.',
      urlAplicacion: item?.urlAplicacion ?? item?.url_aplicacion ?? item?.url ?? '#',
      idAutor: item?.idAutor ?? item?.id_usuario ?? item?.idUsuario ?? item?.id_autor ?? 0,
      estado: item?.estado ?? 'activo',
      fechaCreacion: item?.fechaCreacion ?? item?.fecha_creacion ?? new Date().toISOString(),
      fechaActualizacion: item?.fechaActualizacion ?? item?.fecha_actualizacion ?? new Date().toISOString()
    };
  }
}