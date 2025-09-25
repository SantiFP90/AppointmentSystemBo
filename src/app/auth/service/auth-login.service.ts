import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { Login } from '../interfaces/login.interfce';
import { SuccessLogin } from '../interfaces/success-login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginService {
  private apiUrl = `${environment.apiUrl}/Auth/login`;

  constructor(private http: HttpClient, private router: Router) {}

  login(data: Login): Observable<ApiResponse<SuccessLogin>> {
    const body = { email: data.email, password: data.password };
    return this.http.post<ApiResponse<SuccessLogin>>(this.apiUrl, body);
  }

  getCredentials() {
    return localStorage.getItem('auth_token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isAuthenticated(): boolean {
    const token = this.getCredentials();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // exp está en segundos → pasarlo a ms
      return Date.now() > exp;
    } catch {
      return true; // token inválido
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
