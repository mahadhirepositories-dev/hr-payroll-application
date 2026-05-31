import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveBalance, LeaveRecord } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  getBalances(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/balances`, { params: { year } });
  }

  getStaffBalances(staffId: number, year: number): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(`${this.apiUrl}/staff/${staffId}/${year}`);
  }

  updateBalance(data: {
    staff_id: number;
    leave_type: string;
    total: number;
    year: number;
  }): Observable<LeaveBalance> {
    return this.http.put<LeaveBalance>(`${this.apiUrl}/balance`, data);
  }

  getRecords(month?: string, staffId?: number): Observable<LeaveRecord[]> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    if (staffId) params = params.set('staff_id', staffId);
    return this.http.get<LeaveRecord[]>(`${this.apiUrl}/records`, { params });
  }

  createRecord(data: Partial<LeaveRecord>): Observable<LeaveRecord> {
    return this.http.post<LeaveRecord>(`${this.apiUrl}/records`, data);
  }

  updateRecord(id: number, data: Partial<LeaveRecord>): Observable<LeaveRecord> {
    return this.http.put<LeaveRecord>(`${this.apiUrl}/records/${id}`, data);
  }

  deleteRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/records/${id}`);
  }
}
