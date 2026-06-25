import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  InvestigadorService,
  PerfilInvestigador,
  ActualizarPerfilInvestigadorPayload,
  AplicacionInvestigador
} from '../../services/investigador.service';

import { AuthService, ROL } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-investigador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-investigador.component.html',
  styleUrls: ['./perfil-investigador.component.css']
})
export class PerfilInvestigadorComponent implements OnInit {
  private readonly investigadorService = inject(InvestigadorService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly perfil = signal<PerfilInvestigador | null>(null);
  readonly formulario = signal<PerfilInvestigador | null>(null);
  readonly aplicaciones = signal<AplicacionInvestigador[]>([]);

  readonly cargando = signal<boolean>(true);
  readonly guardando = signal<boolean>(false);
  readonly editando = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const usuarioActual = this.authService.getUsuarioActual();

    if (!this.authService.isLoggedIn() || !usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.authService.rolActual() !== ROL.INVESTIGADOR) {
      this.router.navigate(['/perfil-usuario']);
      return;
    }

    this.cargarPerfil();
    this.cargarAplicaciones();
  }

  /**
   * Carga el perfil del investigador desde la BD
   * Conecta con: InvestigadorController.obtenerPerfil()
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/InvestigadorController.java:28
   */
  cargarPerfil(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.investigadorService.obtenerPerfil().subscribe({
      next: (perfilData: PerfilInvestigador) => {
        const perfilAdaptado = this.adaptarPerfil(perfilData);
        this.perfil.set(perfilAdaptado);
        this.formulario.set(this.clonarPerfil(perfilAdaptado));
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('❌ Error cargando perfil del investigador desde BD:', err);
        this.error.set('Error al cargar el perfil desde la base de datos. Por favor, intenta de nuevo.');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Carga las aplicaciones del investigador desde la BD
   * Conecta con: AplicacionInvestigadorController.listar()
   * Fuente: AgroCastillo-backend/src/main/java/com/agrocastillo/backend/controller/AplicacionInvestigadorController.java:30
   */
  cargarAplicaciones(): void {
    this.investigadorService.obtenerAplicacionesInvestigador().subscribe({
      next: (apps: AplicacionInvestigador[]) => {
        this.aplicaciones.set(apps);
      },
      error: (err: any) => {
        console.warn('⚠️ No se pudieron cargar las aplicaciones del investigador:', err);
        this.aplicaciones.set([]);
      }
    });
  }

  activarEdicion(): void {
    const perfilActual = this.perfil();
    if (!perfilActual) return;

    this.formulario.set(this.clonarPerfil(perfilActual));
    this.editando.set(true);
    this.error.set(null);
  }

  cancelarEdicion(): void {
    const perfilActual = this.perfil();
    if (perfilActual) {
      this.formulario.set(this.clonarPerfil(perfilActual));
    }
    this.editando.set(false);
    this.error.set(null);
  }

  /**
   * Guarda cambios del perfil del investigador en la BD
   * Conecta con: InvestigadorService.actualizarPerfil()
   */
  guardarPerfil(): void {
    const datos = this.formulario();
    if (!datos) return;

    if (!datos.nombreCompleto.trim()) {
      this.error.set('El nombre completo es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const payload: ActualizarPerfilInvestigadorPayload = {
      id: datos.id,
      nombre: datos.nombreCompleto,
      email: datos.correo,
      orcid: datos.orcid,
      cvlac: datos.cvlac,
      institucion: datos.institucion,
      lineaEnfoque: datos.lineaEnfoque
    };

    this.investigadorService.actualizarPerfil(payload).subscribe({
      next: (perfilActualizado: PerfilInvestigador) => {
        const perfilAdaptado = this.adaptarPerfil(perfilActualizado);
        this.perfil.set(perfilAdaptado);
        this.formulario.set(this.clonarPerfil(perfilAdaptado));
        this.editando.set(false);
        this.guardando.set(false);
        this.error.set(null);
      },
      error: (err: any) => {
        console.error('❌ Error guardando perfil en la BD:', err);
        this.error.set('Error al guardar los cambios. Por favor, intenta de nuevo.');
        this.guardando.set(false);
      }
    });
  }

  actualizarCampo<K extends keyof PerfilInvestigador>(
    campo: K,
    valor: PerfilInvestigador[K]
  ): void {
    this.formulario.update((actual) => {
      if (!actual) return actual;
      return {
        ...actual,
        [campo]: valor
      };
    });
  }

  actualizarCompetencia(index: number, porcentaje: number): void {
    this.formulario.update((actual) => {
      if (!actual) return actual;

      const updatedCompetencias = (actual.competencias ?? []).map((competencia, i) =>
        i === index ? { ...competencia, porcentaje } : competencia
      );

      return {
        ...actual,
        competencias: updatedCompetencias
      };
    });
  }

  obtenerInicial(nombre?: string): string {
    return nombre?.trim().charAt(0).toUpperCase() || 'I';
  }

  tieneOrcid(valor?: string): boolean {
    return Boolean(valor && valor.trim().length > 0);
  }

  tieneCvlac(valor?: string): boolean {
    return Boolean(
      valor &&
      valor.trim().length > 0 &&
      !valor.toLowerCase().includes('no registrado')
    );
  }

  /**
   * Mapea datos del backend al formato local
   * Asegura compatibilidad con diferentes formatos de respuesta
   * SE CORRIGIÓ: Casteo de "data" a "any" para permitir la evaluación de cvlacUrl sin errores de tipado estricto.
   */
  private adaptarPerfil(data: PerfilInvestigador): PerfilInvestigador {
    const rawData = data as any; // 👈 Aquí forzamos el bypass de tipado estricto para la lectura dinámica
    return {
      id: data?.id ?? 0,
      nombreCompleto: (data?.nombreCompleto || rawData?.nombre || '').trim() || 'Investigador sin nombre',
      correo: (data?.correo || rawData?.email || '').trim() || 'Sin correo',
      institucion: (data?.institucion || '').trim() || 'Institución Universitaria AgroCastillo',
      lineaEnfoque: (data?.lineaEnfoque || '').trim() || 'Sistemas de Producción Agrícola Sostenible',
      orcid: (data?.orcid || '').trim(),
      cvlac: (data?.cvlac || rawData?.cvlacUrl || '').trim(), // 👈 Solucionado usando rawData
      competencias: Array.isArray(data?.competencias) ? data.competencias : [],
      aplicaciones: Array.isArray(data?.aplicaciones) ? data.aplicaciones : []
    };
  }

  private clonarPerfil(perfil: PerfilInvestigador): PerfilInvestigador {
    return {
      ...perfil,
      competencias: Array.isArray(perfil?.competencias)
        ? perfil.competencias.map((competencia) => ({ ...competencia }))
        : []
    };
  }
}