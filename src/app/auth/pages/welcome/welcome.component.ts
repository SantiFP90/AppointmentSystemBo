import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { Login } from '../../interfaces/login.interfce';
import { AuthLoginService } from '../../service/auth-login.service';

// export interface LoginResponse {
//   success: boolean;
//   token?: string;
//   user?: {
//     id: number;
//     username: string;
//     email: string;
//     role: string;
//   };
//   message?: string;
// }

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    DividerModule,
    RippleModule,
    ProgressSpinnerModule,
    CheckboxModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('cardFlip', [
      state('welcome', style({ transform: 'rotateY(0deg)' })),
      state('login', style({ transform: 'rotateY(180deg)' })),
      transition('welcome => login', animate('600ms ease-in-out')),
      transition('login => welcome', animate('600ms ease-in-out')),
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class WelcomeComponent {
  loginForm: FormGroup;
  showLogin = signal(false);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthLoginService
  ) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  goToGuestCalendar() {
    this.router.navigate(['/client/appointmentsClient']);
  }

  showLoginForm() {
    this.showLogin.set(true);
  }

  backToWelcome() {
    this.showLogin.set(false);
    this.loginForm.reset();
  }

  onLogin() {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const loginData: Login = {
        email: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading.set(false);

          if (response.success) {
            if (response.data!.token) {
              localStorage.setItem('auth_token', response.data!.token);
              localStorage.setItem('user_name', response.data!.userName);
              localStorage.setItem('user_role', response.data!.role);
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Inicio de Sesión Exitoso',
              detail: `Bienvenido/a ${response.data!.userName || 'Usuario'}`,
              life: 4000,
            });

            setTimeout(() => {
              if (response.data!.role === 'Admin') {
                this.router.navigate(['/main/dashboard']);
              } else {
                this.router.navigate(['/client/appointmentsClient']);
              }
            }, 1500);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error de Autenticación',
              detail: response.message || 'Credenciales incorrectas',
              life: 5000,
            });
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Login error:', error);

          let errorMessage = 'Error interno del servidor';

          if (error.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos';
          } else if (error.status === 403) {
            errorMessage = 'Acceso denegado';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar al servidor';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error de Conexión',
            detail: errorMessage,
            life: 6000,
          });
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${
          fieldName === 'username' ? 'Usuario' : 'Contraseña'
        } es requerido`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `Máximo ${maxLength} caracteres`;
      }
    }
    return '';
  }

  demoLogin() {
    this.loginForm.patchValue({
      username: 'demo',
      password: 'demo123',
    });
  }
}
