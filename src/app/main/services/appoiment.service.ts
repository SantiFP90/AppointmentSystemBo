import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import {
  ApiResponse,
  ApiResponsePaged,
} from '../../shared/interfaces/api-response.interface';
import { Appointment } from '../Interfaces/appoiment.interface';
import { CalendarDay } from '../Interfaces/calendar-appoiments.interface';
import { CountAppoiments } from '../Interfaces/count-appoiment.interface';

@Injectable({
  providedIn: 'root',
})
export class AppoimentService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getAppoiment(
    page: number,
    pageSize: number,
    name?: string
  ): Observable<ApiResponsePaged<Appointment>> {
    var params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<ApiResponsePaged<Appointment>>(
      `${this.apiUrl}/Appointment/getAllPaged`,
      { params }
    );
  }

  getAppoimentByMonthYear(
    month: number,
    year: number
  ): Observable<ApiResponse<CalendarDay[]>> {
    return this.http.get<ApiResponse<CalendarDay[]>>(
      `${this.apiUrl}/Appointment/getAppoimentByMonthYear?month=${month}&year=${year}`
    );
  }

  getCountAppoiments(): Observable<ApiResponse<CountAppoiments>> {
    return this.http.get<ApiResponse<CountAppoiments>>(
      `${this.apiUrl}/Appointment/getCounters`
    );
  }

  createAppointment(payload: Appointment): Observable<ApiResponse<null>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/Appointment/create`,
      payload,
      { headers }
    );
  }
}
