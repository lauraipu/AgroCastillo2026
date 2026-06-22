import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AccesibilidadService, IdiomaApp } from '../../services/accesibilidad.service';
import { AuthService, ROL, Usuario } from '../../services/auth.service';

interface IdiomaOption {
  value: IdiomaApp;
  label: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly accesibilidadService = inject(AccesibilidadService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly ROL = ROL;

  readonly menuUsuarioAbierto = signal<boolean>(false);
  readonly panelConfiguracionAbierto = signal<boolean>(false);
  readonly menuMovilAbierto = signal<boolean>(false);

  readonly idiomaActual = this.accesibilidadService.idioma;
  readonly altoContraste = this.accesibilidadService.contrasteAlto;
  readonly textoGrande = this.accesibilidadService.fuenteGrande;
  readonly reducirMovimiento = this.accesibilidadService.reducirMovimiento;

  readonly usuario = computed<Usuario | null>(() => this.authService.usuarioActivo());
  readonly loggedIn = computed<boolean>(() => this.authService.isLoggedIn());
  readonly rol = computed<ROL>(() => this.authService.rolActual());

  readonly inicial = computed<string>(() => {
    const nombre = this.usuario()?.nombre;
    return nombre ? nombre.charAt(0).toUpperCase() : 'U';
  });

  readonly navItems = [
    { label: 'NAV.INICIO', route: '/inicio' },
    { label: 'NAV.APLICACIONES', route: '/aplicaciones' },
    { label: 'NAV.INVESTIGADORES', route: '/investigadores' },
    { label: 'NAV.COMUNIDAD', route: '/comunidad' },
    { label: 'NAV.CONTACTO', route: '/contacto' }
  ];

  readonly idiomas: ReadonlyArray<IdiomaOption> = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'it', label: 'Italiano' },
    { value: 'fr', label: 'Français' }
  ];

  constructor() {
    this.translate.use(this.idiomaActual());
  }

  @HostListener('document:click')
  cerrarPanelesExternos(): void {
    this.menuUsuarioAbierto.set(false);
    this.panelConfiguracionAbierto.set(false);
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.cerrarTodo();
  }

  detenerCierre(event: MouseEvent): void {
    event.stopPropagation();
  }

  toggleMenuUsuario(event: MouseEvent): void {
    event.stopPropagation();

    this.menuUsuarioAbierto.update((valor) => !valor);
    this.panelConfiguracionAbierto.set(false);
  }

  toggleConfiguracion(event: MouseEvent): void {
    event.stopPropagation();

    this.panelConfiguracionAbierto.update((valor) => !valor);
    this.menuUsuarioAbierto.set(false);
  }

  toggleMenuMovil(event: MouseEvent): void {
    event.stopPropagation();

    this.menuMovilAbierto.update((valor) => !valor);
    this.menuUsuarioAbierto.set(false);
    this.panelConfiguracionAbierto.set(false);
  }

  cerrarTodo(): void {
    this.menuUsuarioAbierto.set(false);
    this.panelConfiguracionAbierto.set(false);
    this.menuMovilAbierto.set(false);
  }

  irLogin(): void {
    this.cerrarTodo();
    this.router.navigate(['/login']);
  }

  irRegistro(): void {
    this.cerrarTodo();
    this.router.navigate(['/registro']);
  }

  irPerfil(): void {
    this.cerrarTodo();

    const rolActual = this.rol();

    if (rolActual === ROL.ADMIN) {
      this.router.navigate(['/dashboard-admin']);
      return;
    }

    if (rolActual === ROL.INVESTIGADOR) {
      this.router.navigate(['/perfil-investigador']);
      return;
    }

    this.router.navigate(['/perfil-usuario']);
  }

  irMisAplicaciones(): void {
    this.cerrarTodo();

    const rolActual = this.rol();

    if (rolActual === ROL.INVESTIGADOR) { 
   this.router.navigate(['/perfil-investigador']); 
    return;
  }
    this.router.navigate(['/mis-aplicaciones']);
  }

  irDashboard(): void {
    this.cerrarTodo();

    if (this.rol() !== ROL.ADMIN) {
      this.irPerfil();
      return;
    }

    this.router.navigate(['/dashboard-admin']);
  }

  cerrarSesion(): void {
    this.cerrarTodo();
    this.authService.logout();
  }

  cambiarIdioma(idioma: IdiomaApp): void {
    this.accesibilidadService.cambiarIdioma(idioma);
    this.translate.use(idioma);
  }

  toggleAltoContraste(): void {
    this.accesibilidadService.toggleContraste();
  }

  toggleTextoGrande(): void {
    this.accesibilidadService.toggleFuente();
  }

  toggleReducirMovimiento(): void {
    this.accesibilidadService.toggleMovimiento();
  }
}