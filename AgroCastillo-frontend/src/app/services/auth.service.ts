import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Rol } from '../models/rol.enum';
import { Usuario } from '../models/usuario.model';
import { LoginRequest, RegisterRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';

export { Rol as ROL } from '../models/rol.enum';
export type { Usuario } from '../models/usuario.model';
export type { LoginRequest, RegisterRequest } from '../models/auth-request.model';
export type { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  private readonly API_URL = 'https://localhost:8443/api/auth';

  private readonly tokenKey = 'token';
  private readonly sessionKey = 'ac_session';
  private readonly roleKey = 'role';

  private readonly currentUser = signal<Usuario | null>(this.cargarUsuarioInicial());

  readonly usuarioActivo = computed<Usuario | null>(() => this.currentUser());

  readonly isLoggedIn = computed<boolean>(() =>
    this.currentUser() !== null && this.getToken() !== null
  );

  readonly isAuthenticated = computed<boolean>(() => this.isLoggedIn());

  readonly rolActual = computed<Rol>(() =>
    this.currentUser()?.rol ?? Rol.USUARIO
  );

  readonly userRole = computed<Rol | null>(() =>
    this.currentUser()?.rol ?? null
  );

  readonly inicialAvatar = computed<string>(() => {
    const nombre = this.currentUser()?.nombre;
    return nombre ? nombre.charAt(0).toUpperCase() : 'U';
  });

  login(credenciales: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credenciales).pipe(
      tap((res: AuthResponse) => {
        this.limpiarStorage();

        if (!res.token) {
          throw new Error('El backend no retornó token JWT.');
        }

        const usuario: Usuario = {
          nombre: res.nombre,
          email: res.email ?? credenciales.email,
          rol: this.normalizarRol(res.rol),
          orcid: res.orcid ?? null
        };

        localStorage.setItem(this.tokenKey, res.token);
        this.establecerSesion(usuario);
      })
    );
  }

  finalizarLoginGoogle(email: string, nombre: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(
      `${this.API_URL}/oauth2/success`,
      {
        params: {
          email,
          nombre
        }
      }
    ).pipe(
      tap((res: AuthResponse) => {
        this.limpiarStorage();

        if (!res.token) {
          throw new Error('El backend no retornó token JWT.');
        }

        const usuario: Usuario = {
          nombre: res.nombre,
          email: res.email ?? email,
          rol: this.normalizarRol(res.rol),
          orcid: res.orcid ?? null
        };

        localStorage.setItem(this.tokenKey, res.token);
        this.establecerSesion(usuario);
      })
    );
  }

  registro(datos: RegisterRequest): Observable<string> {
    return this.http.post(`${this.API_URL}/register`, datos, {
      responseType: 'text'
    });
  }

  registrar(datos: RegisterRequest): Observable<string> {
    return this.registro(datos);
  }

  establecerSesion(usuario: Usuario): void {
    const usuarioNormalizado: Usuario = {
      ...usuario,
      rol: this.normalizarRol(usuario.rol)
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(usuarioNormalizado));
    localStorage.setItem(this.roleKey, usuarioNormalizado.rol);

    this.currentUser.set(usuarioNormalizado);
  }

  loginConGoogle(): void {
    this.limpiarStorage();
    window.location.href = 'https://localhost:8443/api/oauth2/authorization/google';
  }

  logout(): void {
    this.limpiarStorage();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getUsuario(): Usuario | null {
    return this.currentUser();
  }

  getUsuarioActual(): Usuario | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRol(): Rol {
    return this.rolActual();
  }

  getUserRole(): Rol {
    return this.rolActual();
  }

  tieneRol(rol: Rol): boolean {
    return this.currentUser()?.rol === rol;
  }

  requireAuth(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  requireGuest(): boolean {
    if (this.isLoggedIn()) {
      this.router.navigate(['/inicio']);
      return false;
    }
    return true;
  }

  redirigirPorRol(): void {
    const rol = this.currentUser()?.rol;

    if (rol === Rol.ADMIN) {
      this.router.navigate(['/dashboard-admin']);
      return;
    }

    if (rol === Rol.INVESTIGADOR) {
      this.router.navigate(['/perfil-investigador']);
      return;
    }

    this.router.navigate(['/perfil-usuario']);
  }

  private cargarUsuarioInicial(): Usuario | null {
    const data = localStorage.getItem(this.sessionKey);
    const token = localStorage.getItem(this.tokenKey);

    if (!data || !token) {
      this.limpiarStorage();
      return null;
    }

    try {
      const usuario = JSON.parse(data) as Usuario;
      return {
        ...usuario,
        rol: this.normalizarRol(usuario.rol)
      };
    } catch {
      this.limpiarStorage();
      return null;
    }
  }

  private limpiarStorage(): void {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);

    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');

    sessionStorage.clear();
  }

  private normalizarRol(rol: string | Rol | null | undefined): Rol {
    const rolTexto = String(rol ?? '')
      .replace('ROLE_', '')
      .trim()
      .toUpperCase();

    if (rolTexto === 'ADMIN' || rolTexto === 'ADMINISTRADOR') {
      return Rol.ADMIN;
    }

    if (rolTexto === 'INVESTIGADOR') {
      return Rol.INVESTIGADOR;
    }

    return Rol.USUARIO;
  }
}