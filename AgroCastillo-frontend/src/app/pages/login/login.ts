import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth-request.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly cargando = signal<boolean>(false);
  readonly errorMensaje = signal<string>('');
  readonly mostrarContrasena = signal<boolean>(false);

  readonly loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]]
  });

  get correo(): AbstractControl {
    return this.loginForm.get('correo') as AbstractControl;
  }

  get contrasena(): AbstractControl {
    return this.loginForm.get('contrasena') as AbstractControl;
  }

  get formularioInvalido(): boolean {
    return this.loginForm.invalid || this.cargando();
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena.update((valor) => !valor);
  }

  loginConGoogle(): void {
    this.authService.loginConGoogle();
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set('');

    const payload: LoginRequest = {
      email: String(this.correo.value).trim().toLowerCase(),
      password: String(this.contrasena.value)
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.cargando.set(false);
        this.authService.redirigirPorRol();
      },
      error: () => {
        this.cargando.set(false);
        this.errorMensaje.set('Credenciales incorrectas. Intenta de nuevo.');
      }
    });
  }
}