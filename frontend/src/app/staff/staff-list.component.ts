import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StaffService } from '../services/staff.service';
import { Staff } from '../models/models';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DecimalPipe],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div>
        <h4>Employee</h4>
        <span class="text-muted">Manage your workforce</span>
      </div>
      <a routerLink="/staff/new" class="btn btn-primary"><i class="bi bi-plus-lg me-1"></i>Add Employee</a>
    </div>
    <div class="card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>EMP Code</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Basic Pay</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of staff">
              <td><span class="badge badge-info">{{ s.emp_code }}</span></td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="user-avatar" style="width:32px;height:32px;font-size:0.6875rem;flex-shrink:0">
                    {{ s.name ? s.name.charAt(0).toUpperCase() : '?' }}
                  </div>
                  <span class="fw-medium">{{ s.name }}</span>
                </div>
              </td>
              <td>{{ s.designation || '-' }}</td>
              <td>{{ s.department || '-' }}</td>
              <td>&#8377; {{ s.basic_pay | number:'1.2-2' }}</td>
              <td><span class="badge" [class.badge-success]="s.is_active" [class.badge-danger]="!s.is_active">{{ s.is_active ? 'Active' : 'Inactive' }}</span></td>
              <td>
                <div class="d-flex gap-1">
                  <a [routerLink]="['/staff', s.id, 'edit']" class="btn btn-soft btn-sm"><i class="bi bi-pencil"></i></a>
                  <button (click)="delete(s)" class="btn btn-soft btn-sm" style="color:var(--danger)"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
            <tr *ngIf="!staff.length"><td colspan="7" class="text-center text-muted py-4">No employees added yet</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class StaffListComponent implements OnInit {
  staff: Staff[] = [];

  constructor(private service: StaffService) {}

  ngOnInit() { this.load(); }

  load() { this.service.getAll().subscribe(s => this.staff = s); }

  delete(s: Staff) {
    if (confirm(`Delete ${s.name}?`)) {
      this.service.delete(s.id).subscribe(() => this.load());
    }
  }
}
