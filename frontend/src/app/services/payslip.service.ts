import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payslip } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PayslipService {
  private apiUrl = `${environment.apiUrl}/payslips`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Payslip[]> {
    return this.http.get<Payslip[]>(this.apiUrl);
  }

  get(id: number): Observable<Payslip> {
    return this.http.get<Payslip>(`${this.apiUrl}/${id}`);
  }

  generate(data: any): Observable<Payslip> {
    return this.http.post<Payslip>(`${this.apiUrl}/generate`, data);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  email(id: number): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${id}/email`, {});
  }
}

