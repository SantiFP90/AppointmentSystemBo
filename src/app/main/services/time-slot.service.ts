import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TimeSlotService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getTimeSlots(workingDayId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/TimeSlot/getAvailableByDay?workingDayId=${workingDayId}`
    );
  }
}
