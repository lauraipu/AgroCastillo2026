import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type IdiomaApp = 'es' | 'en' | 'it' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class AccesibilidadService {

  private readonly documentRef = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly idioma = signal<IdiomaApp>('es');
  readonly contrasteAlto = signal(false);
  readonly fuenteGrande = signal(false);
  readonly reducirMovimiento = signal(false);

  constructor() {
    this.cargarPreferencias();
  }

  cambiarIdioma(idioma: IdiomaApp): void {
    this.idioma.set(idioma);
    this.aplicar();
  }

  toggleContraste(): void {
    this.contrasteAlto.update(valor => !valor);
    this.aplicar();
  }

  toggleFuente(): void {
    this.fuenteGrande.update(valor => !valor);
    this.aplicar();
  }

  toggleMovimiento(): void {
    this.reducirMovimiento.update(valor => !valor);
    this.aplicar();
  }

  private cargarPreferencias(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.idioma.set((localStorage.getItem('idioma') as IdiomaApp) || 'es');
    this.contrasteAlto.set(localStorage.getItem('contrasteAlto') === 'true');
    this.fuenteGrande.set(localStorage.getItem('fuenteGrande') === 'true');
    this.reducirMovimiento.set(localStorage.getItem('reducirMovimiento') === 'true');

    this.aplicar();
  }

  private aplicar(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = this.documentRef.body;
    const html = this.documentRef.documentElement;

    html.lang = this.idioma();

    body.classList.toggle('ac-alto-contraste', this.contrasteAlto());
    body.classList.toggle('ac-fuente-grande', this.fuenteGrande());
    body.classList.toggle('ac-reducir-movimiento', this.reducirMovimiento());

    localStorage.setItem('idioma', this.idioma());
    localStorage.setItem('contrasteAlto', String(this.contrasteAlto()));
    localStorage.setItem('fuenteGrande', String(this.fuenteGrande()));
    localStorage.setItem('reducirMovimiento', String(this.reducirMovimiento()));
  }
}