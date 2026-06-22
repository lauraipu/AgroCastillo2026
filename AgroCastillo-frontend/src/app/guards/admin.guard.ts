import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Rol } from '../models/rol.enum';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.getUsuarioActual();

  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  if (usuario.rol === Rol.ADMIN) {
    return true;
  }

  if (usuario.rol === Rol.INVESTIGADOR) {
    router.navigate(['/perfil-investigador']);
    return false;
  }

  router.navigate(['/perfil-usuario']);
  return false;
};