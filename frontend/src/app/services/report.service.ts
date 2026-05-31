import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonthlyReport, StaffReport, DateRangeReport } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  monthly(): Observable<MonthlyReport[]> {
    return this.http.get<MonthlyReport[]>(`${this.apiUrl}/monthly`);
  }

  staffWise(): Observable<StaffReport[]> {
    return this.http.get<StaffReport[]>(`${this.apiUrl}/staff-wise`);
  }

  dateRange(from: string, to: string): Observable<DateRangeReport> {
    return this.http.post<DateRangeReport>(`${this.apiUrl}/date-range`, { from, to });
  }
}

