import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(month?: string): Observable<DashboardData> {
    const params = month ? `?month=${month}` : '';
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard${params}`);
  }

  getSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/settings`);
  }

  updateSettings(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/settings`, data);
  }

  uploadLogo(file: File): Observable<any> {
    const form = new FormData();
    form.append('logo', file);
    return this.http.post(`${this.apiUrl}/settings/logo`, form);
  }

  getLogo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/settings/logo`);
  }
}
