import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayComponent } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PayComponentService {
  private apiUrl = `${environment.apiUrl}/pay-components`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PayComponent[]> {
    return this.http.get<PayComponent[]>(this.apiUrl);
  }

  create(data: Partial<PayComponent>): Observable<PayComponent> {
    return this.http.post<PayComponent>(this.apiUrl, data);
  }

  update(id: number, data: Partial<PayComponent>): Observable<PayComponent> {
    return this.http.put<PayComponent>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

