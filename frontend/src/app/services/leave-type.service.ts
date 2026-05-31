import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LeaveType {
  id?: number;
  name: string;
  default_days: number;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private url = `${environment.apiUrl}/leave-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(this.url);
  }

  create(data: LeaveType): Observable<LeaveType> {
    return this.http.post<LeaveType>(this.url, data);
  }

  update(id: number, data: LeaveType): Observable<LeaveType> {
    return this.http.put<LeaveType>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
