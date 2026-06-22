import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth-request.model';
import { Rol } from '../../models/rol.enum';
import { TranslateModule } from '@ngx-translate/core';

export type Ocupacion = 'estudiante' | 'docente' | 'investigador';

interface OcupacionOption {
  valor: Ocupacion;
  etiqueta: string;
  descripcion: string;
  icono: string;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmarPassword = control.get('confirmarPassword');

  if (!password || !confirmarPassword) {
    return null;
  }

  if (password.value !== confirmarPassword.value) {
    confirmarPassword.setErrors({ noCoincide: true });
    return { noCoincide: true };
  }

  if (confirmarPassword.errors?.['noCoincide']) {
    const { noCoincide, ...otrosErrores } = confirmarPassword.errors;
    confirmarPassword.setErrors(Object.keys(otrosErrores).length ? otrosErrores : null);
  }

  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly pasoActual = signal<number>(1);
  readonly cargando = signal<boolean>(false);
  readonly exitoso = signal<boolean>(false);
  readonly errorMensaje = signal<string>('');

  readonly mostrarPassword = signal<boolean>(false);
  readonly mostrarConfirmar = signal<boolean>(false);

  readonly ocupaciones: ReadonlyArray<OcupacionOption> = [
    {
      valor: 'estudiante',
      etiqueta: 'Estudiante',
      descripcion: 'Acceso a herramientas de visualización y consulta de datos.',
      icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>`
    },
    {
      valor: 'docente',
      etiqueta: 'Docente',
      descripcion: 'Acceso completo para enseñanza y gestión de proyectos académicos.',
      icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>`
    },
    {
      valor: 'investigador',
      etiqueta: 'Investigador',
      descripcion: 'Permisos avanzados para registrar datos agrícolas y descargar reportes.',
      icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>`
    }
  ];

  readonly registroForm: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', [Validators.required]],
      ocupacion: ['estudiante', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]]
    },
    { validators: passwordMatchValidator }
  );

  get nombre(): AbstractControl {
    return this.registroForm.get('nombre') as AbstractControl;
  }

  get email(): AbstractControl {
    return this.registroForm.get('email') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.registroForm.get('password') as AbstractControl;
  }

  get confirmarPassword(): AbstractControl {
    return this.registroForm.get('confirmarPassword') as AbstractControl;
  }

  get ocupacionCtrl(): AbstractControl {
    return this.registroForm.get('ocupacion') as AbstractControl;
  }

  get terminos(): AbstractControl {
    return this.registroForm.get('terminos') as AbstractControl;
  }

  get ocupacionSeleccionada(): OcupacionOption | null {
    const valor = this.ocupacionCtrl.value as Ocupacion;
    return this.ocupaciones.find((opcion) => opcion.valor === valor) ?? null;
  }

  get paso1Valido(): boolean {
    return this.nombre.valid && this.email.valid && this.ocupacionCtrl.valid;
  }

  get formularioInvalido(): boolean {
    return this.registroForm.invalid || this.cargando();
  }

  avanzarPaso(): void {
    if (this.pasoActual() === 1 && this.paso1Valido) {
      this.pasoActual.set(2);
      return;
    }

    this.nombre.markAsTouched();
    this.email.markAsTouched();
    this.ocupacionCtrl.markAsTouched();
  }

  retrocederPaso(): void {
    if (this.pasoActual() > 1) {
      this.pasoActual.update((valor) => valor - 1);
    }
  }

  seleccionarOcupacion(valor: Ocupacion): void {
    this.ocupacionCtrl.setValue(valor);
    this.ocupacionCtrl.markAsTouched();
  }

  togglePassword(): void {
    this.mostrarPassword.update((valor) => !valor);
  }

  toggleConfirmar(): void {
    this.mostrarConfirmar.update((valor) => !valor);
  }

  loginConGoogle(): void {
    this.authService.loginConGoogle();
  }

  registrar(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set('');

    const ocupacion = this.ocupacionCtrl.value as Ocupacion;

    const payload: RegisterRequest = {
      nombre: String(this.nombre.value).trim(),
      email: String(this.email.value).trim().toLowerCase(),
      password: String(this.password.value),
      rol: this.resolverRol(ocupacion),
      ocupacion,
      orcid: null,
      cvlac: null
    };

    this.authService.registro(payload).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exitoso.set(true);
        setTimeout(() => this.router.navigate(['/login']), 2800);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);

        if (err.status === 409) {
          this.errorMensaje.set('Este correo ya está registrado. Intenta iniciar sesión.');
          return;
        }

        if (err.status === 400) {
          this.errorMensaje.set('Datos inválidos. Revisa los campos e intenta de nuevo.');
          return;
        }

        this.errorMensaje.set('Error en el servidor. Por favor intenta más tarde.');
      }
    });
  }

  private resolverRol(ocupacion: Ocupacion): Rol {
    return ocupacion === 'investigador' ? Rol.INVESTIGADOR : Rol.USUARIO;
  }
}