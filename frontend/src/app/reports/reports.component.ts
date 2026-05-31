import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { LeaveService } from '../services/leave.service';
import { MonthlyReport, StaffReport, DateRangeReport, Payslip, LeaveRecord } from '../models/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, FormsModule, TitleCasePipe],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div>
        <h4>Reports</h4>
        <span class="text-muted">View payroll analytics and summaries</span>
      </div>
      <button class="btn btn-outline-primary" (click)="exportCsv()">
        <i class="bi bi-download me-1"></i> Export CSV
      </button>
    </div>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item"><button class="nav-link" [class.active]="tab==='monthly'" (click)="tab='monthly';load()">Monthly Summary</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab==='staff'" (click)="tab='staff';load()">Staff Wise</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab==='daterange'" (click)="tab='daterange'">Date Range</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab==='leaves'" (click)="tab='leaves';load()">Leaves</button></li>
    </ul>

    <div *ngIf="tab==='monthly'">
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Payslips</th>
                <th>Gross</th>
                <th>Deductions</th>
                <th>Net Pay</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of monthlyData">
                <td class="fw-medium">{{ r.month }}</td>
                <td><span class="badge badge-info">{{ r.total }}</span></td>
                <td>&#8377; {{ r.total_gross | number:'1.2-2' }}</td>
                <td>&#8377; {{ r.total_deductions | number:'1.2-2' }}</td>
                <td><strong style="color:var(--primary)">&#8377; {{ r.total_net | number:'1.2-2' }}</strong></td>
              </tr>
              <tr *ngIf="!monthlyData.length"><td colspan="5" class="text-center text-muted py-4">No data</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div *ngIf="tab==='staff'">
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>EMP Code</th>
                <th>Name</th>
                <th>Total Payslips</th>
                <th>Total Net Pay</th>
                <th>Last Payslip</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of staffData">
                <td><span class="badge badge-info">{{ r.emp_code }}</span></td>
                <td class="fw-medium">{{ r.name }}</td>
                <td>{{ r.total_payslips }}</td>
                <td><strong style="color:var(--primary)">&#8377; {{ r.total_net_pay | number:'1.2-2' }}</strong></td>
                <td style="font-size:0.8125rem;color:var(--text-muted)">{{ r.last_payslip || '-' }}</td>
              </tr>
              <tr *ngIf="!staffData.length"><td colspan="5" class="text-center text-muted py-4">No data</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div *ngIf="tab==='daterange'">
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-auto"><label class="form-label">From</label><input type="month" class="form-control" [(ngModel)]="rangeFrom"></div>
            <div class="col-auto"><label class="form-label">To</label><input type="month" class="form-control" [(ngModel)]="rangeTo"></div>
            <div class="col-auto"><button class="btn btn-primary" (click)="loadRange()"><i class="bi bi-search me-1"></i>Search</button></div>
          </div>
          <div *ngIf="rangeSummary" class="row g-3 mt-3">
            <div class="col-md-3">
              <div class="stat-card p-3 text-center">
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Payslips</div>
                <div class="fw-bold" style="font-size:1.5rem">{{ rangeSummary.total_payslips }}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card p-3 text-center">
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Gross</div>
                <div class="fw-bold" style="font-size:1.5rem;color:var(--success)">&#8377; {{ rangeSummary.total_gross | number:'1.2-2' }}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card p-3 text-center">
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Deductions</div>
                <div class="fw-bold" style="font-size:1.5rem;color:var(--danger)">&#8377; {{ rangeSummary.total_deductions | number:'1.2-2' }}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card p-3 text-center">
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Net</div>
                <div class="fw-bold" style="font-size:1.5rem;color:var(--primary)">&#8377; {{ rangeSummary.total_net | number:'1.2-2' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Month</th>
                <th>Basic</th>
                <th>Gross</th>
                <th>Deductions</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of rangeData">
                <td class="fw-medium">{{ p.staff?.name }} ({{ p.staff?.emp_code }})</td>
                <td>{{ p.month }}</td>
                <td>&#8377; {{ p.basic_pay | number:'1.2-2' }}</td>
                <td>&#8377; {{ p.gross_earnings | number:'1.2-2' }}</td>
                <td>&#8377; {{ p.total_deductions | number:'1.2-2' }}</td>
                <td><strong style="color:var(--primary)">&#8377; {{ p.net_pay | number:'1.2-2' }}</strong></td>
              </tr>
              <tr *ngIf="!rangeData.length"><td colspan="6" class="text-center text-muted py-4">Select date range and search</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div *ngIf="tab==='leaves'">
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-auto"><label class="form-label">Month</label><input type="month" class="form-control" [(ngModel)]="leaveMonth"></div>
            <div class="col-auto"><button class="btn btn-primary" (click)="loadLeaves()"><i class="bi bi-search me-1"></i>Search</button></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of leavesData">
                <td class="fw-medium">{{ l.staff?.name }} ({{ l.staff?.emp_code }})</td>
                <td class="text-capitalize">{{ l.leave_type }}</td>
                <td>{{ l.from_date }}</td>
                <td>{{ l.to_date }}</td>
                <td>{{ l.days }}</td>
                <td>
                  <span class="badge" [class.badge-success]="l.status === 'approved'" [class.badge-warning]="l.status === 'pending'">
                    {{ l.status | titlecase }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="!leavesData.length"><td colspan="6" class="text-center text-muted py-4">No leave records found</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  tab = 'monthly';
  monthlyData: MonthlyReport[] = [];
  staffData: StaffReport[] = [];
  rangeData: Payslip[] = [];
  leavesData: LeaveRecord[] = [];
  rangeSummary: DateRangeReport['summary'] | null = null;
  rangeFrom = new Date().toISOString().substring(0, 7);
  rangeTo = new Date().toISOString().substring(0, 7);
  leaveMonth = new Date().toISOString().substring(0, 7);

  constructor(private reportService: ReportService, private leaveService: LeaveService) {}

  ngOnInit() { this.load(); }

  load() {
    if (this.tab === 'monthly') this.reportService.monthly().subscribe(d => this.monthlyData = d);
    else if (this.tab === 'staff') this.reportService.staffWise().subscribe(d => this.staffData = d);
    else if (this.tab === 'leaves') this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getRecords(this.leaveMonth).subscribe(d => this.leavesData = d);
  }

  loadRange() {
    this.reportService.dateRange(this.rangeFrom, this.rangeTo).subscribe(r => {
      this.rangeData = r.payslips;
      this.rangeSummary = r.summary;
    });
  }

  exportCsv() {
    let csv = '';
    const delimiter = ',';

    if (this.tab === 'monthly') {
      csv += 'Month,Payslips,Gross,Deductions,Net Pay\n';
      this.monthlyData.forEach(r => {
        csv += `${r.month},${r.total},${r.total_gross},${r.total_deductions},${r.total_net}\n`;
      });
    } else if (this.tab === 'staff') {
      csv += 'EMP Code,Name,Total Payslips,Total Net Pay,Last Payslip\n';
      this.staffData.forEach(r => {
        csv += `${r.emp_code},"${r.name}",${r.total_payslips},${r.total_net_pay},${r.last_payslip || ''}\n`;
      });
    } else if (this.tab === 'daterange') {
      csv += 'Staff EMP Code,Staff Name,Month,Basic,Gross,Deductions,Net\n';
      this.rangeData.forEach(p => {
        const empCode = p.staff?.emp_code || '';
        const name = p.staff?.name || '';
        csv += `${empCode},"${name}",${p.month},${p.basic_pay},${p.gross_earnings},${p.total_deductions},${p.net_pay}\n`;
      });
    } else if (this.tab === 'leaves') {
      csv += 'Staff EMP Code,Staff Name,Leave Type,From Date,To Date,Days,Status\n';
      this.leavesData.forEach(l => {
        const empCode = l.staff?.emp_code || '';
        const name = l.staff?.name || '';
        csv += `${empCode},"${name}",${l.leave_type},${l.from_date},${l.to_date},${l.days},${l.status}\n`;
      });
    }

    if (!csv) return;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${this.tab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
