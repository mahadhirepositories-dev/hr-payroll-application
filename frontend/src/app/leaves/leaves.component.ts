import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../services/leave.service';
import { StaffService } from '../services/staff.service';
import { LeaveTypeService, LeaveType } from '../services/leave-type.service';
import { Staff, LeaveRecord } from '../models/models';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <h4>Leave Management</h4>
        <span class="text-muted">Track employee leave records</span>
      </div>
      <div class="d-flex gap-2">
        <select class="form-select form-select-sm" style="width:auto" [(ngModel)]="selectedStaffId" (change)="loadRecords()">
          <option value="">All Employees</option>
          <option *ngFor="let s of staffList" [value]="s.id">{{ s.name }}</option>
        </select>
        <input type="month" class="form-control form-control-sm" style="width:160px" [(ngModel)]="filterMonth" (change)="loadRecords()">
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-5">
        <div class="card">
          <div class="card-body">
            <h6 class="fw-semibold mb-3"><i class="bi bi-plus-circle me-2" style="color:var(--primary)"></i>Mark Leave</h6>
            <div *ngIf="formError" class="alert alert-danger py-2">{{ formError }}</div>
            <form (ngSubmit)="saveRecord()">
              <div class="mb-3">
                <label class="form-label">Employee *</label>
                <select class="form-select" [(ngModel)]="form.staff_id" name="staff_id" required>
                  <option value="">-- Select --</option>
                  <option *ngFor="let s of staffList" [value]="s.id">{{ s.name }} ({{ s.emp_code }})</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Leave Type</label>
                <select class="form-select" [(ngModel)]="form.leave_type" name="leave_type">
                  <option *ngFor="let lt of leaveTypes" [value]="lt.name">{{ lt.name }}</option>
                </select>
              </div>
              <div class="row g-2 mb-3">
                <div class="col">
                  <label class="form-label">From Date *</label>
                  <input type="date" class="form-control" [(ngModel)]="form.from_date" name="from_date" required>
                </div>
                <div class="col">
                  <label class="form-label">To Date *</label>
                  <input type="date" class="form-control" [(ngModel)]="form.to_date" name="to_date" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Reason</label>
                <input type="text" class="form-control" [(ngModel)]="form.reason" name="reason" placeholder="e.g. Sick leave, personal">
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" [(ngModel)]="form.status" name="status">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  <i class="bi bi-check-lg me-1"></i>{{ editingId ? 'Update' : 'Save' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" *ngIf="editingId" (click)="cancelEdit()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-7">
        <div class="card">
          <div class="table-responsive" style="max-height:500px">
            <table class="table">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of records">
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="user-avatar" style="width:32px;height:32px;font-size:0.6875rem;flex-shrink:0">
                        {{ (r.staff?.name?.charAt(0) || '').toUpperCase() || '?' }}
                      </div>
                      <span class="fw-medium" style="font-size:0.8125rem">{{ r.staff?.name }}</span>
                    </div>
                  </td>
                  <td style="font-size:0.8125rem">{{ r.leave_type }}</td>
                  <td style="font-size:0.8125rem">{{ r.from_date | date:'shortDate' }}</td>
                  <td style="font-size:0.8125rem">{{ r.to_date | date:'shortDate' }}</td>
                  <td><span class="badge badge-info">{{ r.days || 1 }}</span></td>
                  <td style="font-size:0.8125rem;color:var(--text-secondary);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.reason || '-' }}</td>
                  <td><span class="badge" [class.badge-success]="r.status==='approved'" [class.badge-warning]="r.status==='pending'">{{ r.status }}</span></td>
                  <td>
                    <div class="d-flex gap-1">
                      <button class="btn btn-soft btn-sm" (click)="editRecord(r)"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-soft btn-sm" style="color:var(--danger)" (click)="deleteRecord(r)"><i class="bi bi-trash"></i></button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="!records.length"><td colspan="8" class="text-center text-muted py-4">No leave records</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>Leave Balances</span>
        <select class="form-select form-select-sm" style="width:100px" [(ngModel)]="balanceYear" (change)="loadBalances()">
          <option *ngFor="let y of years" [value]="y">{{ y }}</option>
        </select>
      </div>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>EMP Code</th>
              <th>Name</th>
              <ng-container *ngFor="let lt of leaveTypes">
                <th colspan="3" class="text-center" style="background:#F8F9FA">{{ lt.name }} Leave</th>
              </ng-container>
              <th></th>
            </tr>
            <tr>
              <th></th><th></th>
              <ng-container *ngFor="let lt of leaveTypes">
                <th>Total</th><th>Used</th><th>Avail</th>
              </ng-container>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of staffBalances">
              <td><span class="badge badge-info">{{ s.emp_code }}</span></td>
              <td class="fw-medium">{{ s.name }}</td>
              <ng-container *ngFor="let lt of leaveTypes">
                <td><input type="number" class="form-control form-control-sm" style="width:65px" [(ngModel)]="s['_total_'+lt.name]" (change)="updateBalance(s, lt.name)"></td>
                <td>{{ getUsed(s, lt.name) }}</td>
                <td><span class="fw-semibold" style="color:var(--success)">{{ (s['_total_'+lt.name] || 0) - getUsed(s, lt.name) }}</span></td>
              </ng-container>
              <td><span class="text-success small" *ngIf="s._saved"><i class="bi bi-check-circle"></i></span></td>
            </tr>
            <tr *ngIf="!staffBalances.length"><td colspan="100%" class="text-center text-muted py-4">No staff found</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class LeavesComponent implements OnInit {
  records: LeaveRecord[] = [];
  staffList: Staff[] = [];
  staffBalances: any[] = [];
  leaveTypes: LeaveType[] = [];
  filterMonth = new Date().toISOString().substring(0, 7);
  selectedStaffId = '';
  balanceYear = new Date().getFullYear();
  years = [this.balanceYear - 1, this.balanceYear, this.balanceYear + 1];

  form: Partial<LeaveRecord> = { staff_id: 0, leave_type: '', from_date: '', to_date: '', reason: '', status: 'pending' };
  editingId: number | null = null;
  formError = '';
  saving = false;

  constructor(
    private leaveService: LeaveService, 
    private staffService: StaffService,
    private leaveTypeService: LeaveTypeService
  ) {}

  ngOnInit() {
    this.leaveTypeService.getAll().subscribe(lt => {
      this.leaveTypes = lt.filter(l => l.is_active);
      if (this.leaveTypes.length > 0) {
        this.form.leave_type = this.leaveTypes[0].name;
      }
      this.staffService.getAll().subscribe(s => this.staffList = s);
      this.loadRecords();
      this.loadBalances();
    });
  }

  loadRecords() {
    this.leaveService.getRecords(
      this.filterMonth,
      this.selectedStaffId ? Number(this.selectedStaffId) : undefined
    ).subscribe(r => this.records = r);
  }

  loadBalances() {
    this.staffService.getAll().subscribe(allStaff => {
      this.leaveService.getBalances(this.balanceYear).subscribe((staffWithBalances: any) => {
        this.staffBalances = allStaff.map(s => {
          const wb = staffWithBalances.find((swb: any) => swb.id === s.id);
          const balanceRow: any = {
            ...s,
            _saved: false,
          };
          this.leaveTypes.forEach(lt => {
            const lb = wb?.leave_balances?.find((l: any) => l.leave_type === lt.name);
            balanceRow['_total_' + lt.name] = lb?.total || lt.default_days;
          });
          return balanceRow;
        });
      });
    });
  }

  getUsed(s: any, type: string) {
    const lb = s.leave_balances?.find((l: any) => l.leave_type === type);
    return lb?.used || 0;
  }

  updateBalance(s: any, type: string) {
    const total = s['_total_' + type];
    this.leaveService.updateBalance({
      staff_id: s.id,
      leave_type: type,
      total: total || 0,
      year: this.balanceYear,
    }).subscribe(() => {
      s._saved = true;
      setTimeout(() => s._saved = false, 1500);
    });
  }

  editRecord(r: LeaveRecord) {
    this.editingId = r.id;
    this.form = {
      staff_id: r.staff_id,
      leave_type: r.leave_type,
      from_date: r.from_date.substring(0, 10),
      to_date: r.to_date.substring(0, 10),
      reason: r.reason,
      status: r.status,
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { 
      staff_id: 0, 
      leave_type: this.leaveTypes.length > 0 ? this.leaveTypes[0].name : '', 
      from_date: '', 
      to_date: '', 
      reason: '', 
      status: 'pending' 
    };
  }

  saveRecord() {
    this.saving = true;
    this.formError = '';
    const data: any = {
      staff_id: Number(this.form.staff_id),
      leave_type: this.form.leave_type,
      from_date: this.form.from_date,
      to_date: this.form.to_date,
      reason: this.form.reason || '',
      status: this.form.status || 'pending',
    };
    const obs = this.editingId
      ? this.leaveService.updateRecord(this.editingId, data)
      : this.leaveService.createRecord(data);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.cancelEdit();
        this.loadRecords();
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to save';
        this.saving = false;
      },
    });
  }

  deleteRecord(r: LeaveRecord) {
    if (confirm(`Delete leave for ${r.staff?.name}?`)) {
      this.leaveService.deleteRecord(r.id).subscribe(() => this.loadRecords());
    }
  }
}
