import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si el usuario tiene una sesión activa en el servicio
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no está autenticado, lo redirigimos al login de forma segura
  router.navigate(['/login']);
  return false;
};