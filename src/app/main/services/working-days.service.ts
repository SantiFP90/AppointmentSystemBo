import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class WorkingDaysService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getWokingDays(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/WorkingDay/getAllPaged?page=${page}&pageSize=${pageSize}`
    );
  }
}
