import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { CreateWorkingDay } from '../Interfaces/workingDay.interface';

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

  createWorkingDay(data: CreateWorkingDay): Observable<ApiResponse<any[]>> {
    return this.http.post<ApiResponse<any[]>>(
      `${this.apiUrl}/WorkingDay/createRangeAsync`,
      data
    );
  }
}
