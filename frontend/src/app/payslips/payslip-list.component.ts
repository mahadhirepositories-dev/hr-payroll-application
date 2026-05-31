import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PayslipService } from '../services/payslip.service';
import { Payslip } from '../models/models';

@Component({
  selector: 'app-payslip-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DatePipe, DecimalPipe],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div>
        <h4>Payroll</h4>
        <span class="text-muted">Manage payslips and salary</span>
      </div>
      <a routerLink="/payslips/generate" class="btn btn-primary"><i class="bi bi-plus-lg me-1"></i>Generate Payslip</a>
    </div>
    <div *ngIf="emailSuccess" class="alert alert-success mt-3 mx-3 py-2 mb-0" style="font-size: 0.85rem"><i class="bi bi-check-circle me-1"></i>{{ emailSuccess }}</div>
    <div *ngIf="emailError" class="alert alert-danger mt-3 mx-3 py-2 mb-0" style="font-size: 0.85rem"><i class="bi bi-exclamation-circle me-1"></i>{{ emailError }}</div>
    <div class="card mt-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Staff</th>
              <th>EMP Code</th>
              <th>Month</th>
              <th>Basic</th>
              <th>Net Pay</th>
              <th>Leaves</th>
              <th>Generated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of payslips">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="user-avatar" style="width:32px;height:32px;font-size:0.6875rem;flex-shrink:0">
                    {{ (p.staff?.name?.charAt(0) || '').toUpperCase() || '?' }}
                  </div>
                  <span class="fw-medium">{{ p.staff?.name }}</span>
                </div>
              </td>
              <td><span class="badge badge-info">{{ p.staff?.emp_code }}</span></td>
              <td>{{ p.month }}</td>
              <td>&#8377; {{ p.basic_pay | number:'1.2-2' }}</td>
              <td><strong style="color:var(--primary)">&#8377; {{ p.net_pay | number:'1.2-2' }}</strong></td>
              <td><span style="font-size:0.8125rem">{{ p.casual_leaves_taken }}C / {{ p.medical_leaves_taken }}M</span></td>
              <td style="font-size:0.8125rem;color:var(--text-muted)">{{ p.created_at | date:'medium' }}</td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-soft btn-sm" (click)="download(p)" title="Download PDF"><i class="bi bi-download"></i></button>
                  <button class="btn btn-soft btn-sm" style="color: #6366f1;" (click)="email(p)" [disabled]="emailingId === p.id" title="Email to Staff">
                    <span *ngIf="emailingId === p.id" class="spinner-border spinner-border-sm" style="width: 1rem; height: 1rem; border-width: 0.15em;"></span>
                    <i *ngIf="emailingId !== p.id" class="bi bi-envelope"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="!payslips.length"><td colspan="8" class="text-center text-muted py-4">No payslips generated yet</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PayslipListComponent implements OnInit {
  payslips: Payslip[] = [];
  emailingId: number | null = null;
  emailSuccess: string = '';
  emailError: string = '';

  constructor(private service: PayslipService) {}

  ngOnInit() { this.load(); }

  load() { this.service.getAll().subscribe(p => this.payslips = p); }

  download(p: Payslip) {
    this.service.download(p.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${p.staff?.emp_code}_${p.month}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  email(p: Payslip) {
    this.emailingId = p.id;
    this.emailError = '';
    this.emailSuccess = '';
    
    this.service.email(p.id).subscribe({
      next: (res) => {
        this.emailingId = null;
        this.emailSuccess = `Payslip successfully emailed to ${p.staff?.name}!`;
        setTimeout(() => this.emailSuccess = '', 4000);
      },
      error: (err) => {
        this.emailingId = null;
        this.emailError = err.error?.message || 'Failed to send email. Please ensure SMTP is configured correctly.';
        setTimeout(() => this.emailError = '', 6000);
      }
    });
  }
}
