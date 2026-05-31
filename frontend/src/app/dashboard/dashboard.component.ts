import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../services/setting.service';
import { StaffService } from '../services/staff.service';
import { LeaveService } from '../services/leave.service';
import { DashboardData, Staff, LeaveRecord } from '../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="dashboard">
      <div class="page-header d-flex flex-wrap justify-content-between align-items-center">
        <div>
          <h4>Employee Overview</h4>
          <span class="text-muted">Last updated: {{ now | date:'MMM dd, yyyy hh:mm a' }}</span>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <input type="month" class="form-control form-control-sm" style="width:160px" [(ngModel)]="filterMonth" (change)="loadData()">
          <button class="btn btn-soft btn-sm" (click)="refresh()"><i class="bi bi-arrow-clockwise"></i></button>
          <button class="btn btn-primary btn-sm"><i class="bi bi-download me-1"></i>Export</button>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4 col-6">
          <div class="stat-card">
            <div class="d-flex justify-content-between mb-2">
              <div class="stat-icon" style="background:#F0EFFF;color:#5B4DFF"><i class="bi bi-people"></i></div>
            </div>
            <div class="stat-value">{{ totalStaff }}</div>
            <div class="stat-label">Total Employee</div>
          </div>
        </div>
        <div class="col-md-4 col-6">
          <div class="stat-card">
            <div class="d-flex justify-content-between mb-2">
              <div class="stat-icon" style="background:#ECFDF5;color:#10B981"><i class="bi bi-cash-coin"></i></div>
            </div>
            <div class="stat-value">&#8377; {{ totalSalary | number:'1.2-2' }}</div>
            <div class="stat-label">Total Salary</div>
          </div>
        </div>
        <div class="col-md-4 col-6">
          <div class="stat-card">
            <div class="d-flex justify-content-between mb-2">
              <div class="stat-icon" style="background:#FFFBEB;color:#F59E0B"><i class="bi bi-calendar"></i></div>
            </div>
            <div class="stat-value">{{ totalLeaveThisMonth }}</div>
            <div class="stat-label">Total Leave This Month</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>Leave Records</span>
          <div class="d-flex gap-2">
            <input type="month" class="form-control form-control-sm" style="width:160px" [(ngModel)]="leaveFilterMonth" (change)="loadLeaves()">
          </div>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of leaveRecords">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="user-avatar" style="width:32px;height:32px;font-size:0.6875rem;flex-shrink:0">
                      {{ (l.staff?.name?.charAt(0) || '').toUpperCase() || '?' }}
                    </div>
                    <span class="fw-medium">{{ l.staff?.name }}</span>
                  </div>
                </td>
                <td>{{ l.from_date | date:'mediumDate' }}</td>
                <td>{{ l.to_date | date:'mediumDate' }}</td>
                <td><span class="badge badge-info">{{ l.days || 1 }}</span></td>
                <td style="color:var(--text-secondary)">{{ l.reason || '-' }}</td>
                <td><span class="badge" [class.badge-success]="l.status==='approved'" [class.badge-warning]="l.status==='pending'">{{ l.status }}</span></td>
              </tr>
              <tr *ngIf="!leaveRecords.length">
                <td colspan="6" class="text-center text-muted py-4">No leave records for this month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  now = new Date();
  totalStaff = 0;
  totalSalary = 0;
  totalLeaveThisMonth = 0;
  employees: Staff[] = [];
  leaveRecords: LeaveRecord[] = [];
  filterMonth = new Date().toISOString().substring(0, 7);
  leaveFilterMonth = new Date().toISOString().substring(0, 7);

  constructor(
    private settingService: SettingService,
    private staffService: StaffService,
    private leaveService: LeaveService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.settingService.getDashboard(this.filterMonth).subscribe(d => {
      this.totalStaff = d.totalStaff;
      this.totalSalary = d.totalSalary;
      this.totalLeaveThisMonth = d.totalLeaveThisMonth;
    });
    this.staffService.getAll().subscribe(s => this.employees = s);
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getRecords(this.leaveFilterMonth).subscribe(r => this.leaveRecords = r);
  }

  refresh() {
    this.now = new Date();
    this.loadData();
  }
}
