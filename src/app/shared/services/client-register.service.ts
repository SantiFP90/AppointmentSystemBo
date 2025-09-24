import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { UserRegister } from '../interfaces/user-register.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientRegisterService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  createClient(clientData: FormData): Observable<ApiResponse<UserRegister>> {
    return this.http.post<ApiResponse<UserRegister>>(
      `${this.apiUrl}/Auth/register`,
      clientData
    );
  }

  getClientById(clientId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(
      `${this.apiUrl}/Auth/getUserById?id=${clientId}`,
      {
        headers,
      }
    );
  }
}
