import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { investigadorGuard } from './guards/investigador.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },

  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio').then((m) => m.InicioComponent)
  },

  {
    path: 'aplicaciones',
    loadComponent: () =>
      import('./pages/aplicaciones/aplicaciones').then(
        (m) => m.AplicacionesComponent
      )
  },

  {
    path: 'detalle-aplicacion/:id',
    loadComponent: () =>
      import('./pages/detalle-aplicacion/detalle-aplicacion').then(
        (m) => m.DetalleAplicacionComponent
      )
  },

  {
    path: 'investigadores',
    loadComponent: () =>
      import('./pages/investigadores/investigadores.component').then(
        (m) => m.InvestigadoresComponent
      )
  },

  {
    path: 'comunidad',
    loadComponent: () =>
      import('./pages/comunidad/comunidad').then(
        (m) => m.ComunidadComponent
      )
  },

  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto').then(
        (m) => m.ContactoComponent
      )
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(
        (m) => m.LoginComponent
      )
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro').then(
        (m) => m.RegistroComponent
      )
  },

  {
    path: 'oauth-callback',
    loadComponent: () =>
      import('./pages/oauth-callback/oauth-callback').then(
        (m) => m.OauthCallbackComponent
      )
  },

  {
    path: 'perfil-usuario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/perfil-usuario/perfil-usuario').then(
        (m) => m.PerfilUsuarioComponent
      )
  },

  {
    path: 'perfil-investigador',
    canActivate: [authGuard, investigadorGuard],
    loadComponent: () =>
      import('./pages/perfil-investigador/perfil-investigador.component').then(
        (m) => m.PerfilInvestigadorComponent
      )
  },

  {
    path: 'mis-aplicaciones',
    canActivate: [authGuard, investigadorGuard],
    loadComponent: () =>
      import('./pages/mis-aplicaciones/mis-aplicaciones').then(
        (m) => m.MisAplicacionesComponent
      )
  },

  {
    path: 'dashboard-admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/dashboard-admin/dashboard-admin.component').then(
        (m) => m.DashboardAdminComponent
      )
  },

  {
    path: '**',
    redirectTo: 'inicio'
  }
];