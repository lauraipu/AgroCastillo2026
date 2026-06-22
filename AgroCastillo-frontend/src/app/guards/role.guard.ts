import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const rolUsuario = normalizarRol(authService.getUserRole());
  const rolesPermitidos = (route.data?.['roles'] ?? []) as string[];

  if (rolesPermitidos.length === 0) {
    return true;
  }

  const permitido = rolesPermitidos
    .map((rol) => normalizarRol(rol))
    .includes(rolUsuario);

  if (!permitido) {
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};

function normalizarRol(rol: unknown): string {
  return String(rol ?? '')
    .replace('ROLE_', '')
    .trim()
    .toUpperCase();
}