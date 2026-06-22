import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const esApiAgroCastillo =
    req.url.startsWith('http://localhost:8443/api') ||
    req.url.startsWith('/api');

  /*
   * Solo se excluyen rutas realmente públicas de autenticación.
   * NO excluimos /investigadores ni /aplicaciones completas,
   * porque algunas rutas internas como /investigadores/perfil
   * o /aplicaciones/mis-aplicaciones necesitan JWT.
   */
  const esRutaAuthPublica =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/registro') ||
    req.url.includes('/auth/oauth2/success') ||
    req.url.includes('/oauth2/authorization/google') ||
    req.url.includes('/login/oauth2/code/google');

  let authReq = req;

  if (esApiAgroCastillo && token && !esRutaAuthPublica) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !esRutaAuthPublica) {
        auth.logout();
      }

      return throwError(() => error);
    })
  );
};