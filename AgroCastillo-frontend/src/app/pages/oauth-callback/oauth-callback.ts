import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oauth-callback.html',
  styleUrls: ['./oauth-callback.css']
})
export class OauthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly cargando = signal<boolean>(true);
  readonly errorMensaje = signal<string>('');

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const nombre = this.route.snapshot.queryParamMap.get('nombre');

    if (!email || !nombre) {
      this.cargando.set(false);
      this.errorMensaje.set('No fue posible completar el inicio de sesión con Google.');
      return;
    }

    this.authService.finalizarLoginGoogle(email, nombre).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/inicio']);
      },
      error: () => {
        this.cargando.set(false);
        this.errorMensaje.set('No fue posible validar tu cuenta de Google con AgroCastillo.');
      }
    });
  }
}