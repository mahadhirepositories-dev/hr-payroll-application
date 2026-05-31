import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StaffService } from '../services/staff.service';
import { PayComponentService } from '../services/pay-component.service';
import { LeaveService } from '../services/leave.service';
import { PayslipService } from '../services/payslip.service';
import { Staff, PayslipFormComponent } from '../models/models';

@Component({
  selector: 'app-payslip-generate',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  template: `
    <div class="page-header d-flex align-items-center gap-3">
      <a routerLink="/payslips" class="btn btn-soft btn-sm"><i class="bi bi-arrow-left"></i></a>
      <div>
        <h4>Generate Payslip</h4>
        <span class="text-muted">Leaves are auto-calculated from approved leave records</span>
      </div>
    </div>
    <div class="card" style="max-width:800px">
      <div class="card-body">
        <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success py-2 d-flex justify-content-between align-items-center">
          <span><i class="bi bi-check-circle me-1"></i>Payslip generated successfully!</span>
          <a routerLink="/payslips" class="btn btn-sm btn-outline-primary">View All</a>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="row g-3 mb-3">
            <div class="col">
              <label class="form-label">Employee *</label>
              <select class="form-select" [(ngModel)]="selectedStaffId" name="staff_id" required (change)="onStaffChange()">
                <option value="">-- Select Employee --</option>
                <option *ngFor="let s of staff" [value]="s.id">{{ s.name }} ({{ s.emp_code }})</option>
              </select>
            </div>
            <div class="col">
              <label class="form-label">Month *</label>
              <input type="month" class="form-control" [(ngModel)]="month" name="month" required (change)="onStaffChange()">
            </div>
            <div class="col">
              <label class="form-label">Pay Date *</label>
              <input type="date" class="form-control" [(ngModel)]="payDate" name="pay_date" required>
            </div>
          </div>

          <div class="card mb-4" style="border-color:var(--border);box-shadow:none;background:var(--bg)" *ngIf="leaveSummary">
            <div class="card-body py-3">
              <div class="row text-center">
                <div class="col-4">
                  <div style="font-size:0.75rem;color:var(--text-muted)">Leave Days (This Month)</div>
                  <div class="fw-bold" style="font-size:1.25rem;color:var(--danger)">{{ leaveSummary.totalDays }}</div>
                </div>
                <div class="col-4">
                  <div style="font-size:0.75rem;color:var(--text-muted)">Paid Days</div>
                  <div class="fw-bold" style="font-size:1.25rem;color:var(--success)">{{ leaveSummary.paidDays }}</div>
                </div>
                <div class="col-4">
                  <div style="font-size:0.75rem;color:var(--text-muted)">Leave Balance</div>
                  <div class="fw-bold" style="font-size:1.25rem;color:var(--primary)">{{ leaveSummary.balance }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-end mb-3">
            <h6 class="fw-semibold mb-0"><i class="bi bi-list-check me-2" style="color:var(--primary)"></i>Pay Components</h6>
          </div>
          <div class="card mb-3" style="border-color:var(--border);box-shadow:none">
            <div class="table-responsive">
              <table class="table mb-0">
                <thead>
                  <tr>
                    <th style="width:35%">Component</th>
                    <th style="width:25%">Type</th>
                    <th style="width:30%">Amount</th>
                    <th style="width:10%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="selectedStaff">
                    <td><input type="text" class="form-control form-control-sm" value="Basic Pay" readonly style="background-color: var(--bs-gray-100)"></td>
                    <td>
                      <select class="form-select form-select-sm" disabled style="background-color: var(--bs-gray-100)">
                        <option value="earning" selected>Earning</option>
                      </select>
                    </td>
                    <td><input type="number" step="0.01" class="form-control form-control-sm" [(ngModel)]="basicPayOverride" name="basic_pay" required></td>
                    <td></td>
                  </tr>
                  <tr *ngFor="let c of components; let i = index">
                    <td><input type="text" class="form-control form-control-sm" [(ngModel)]="c.name" [name]="'name_'+i" required></td>
                    <td>
                      <select class="form-select form-select-sm" [(ngModel)]="c.type" [name]="'type_'+i">
                        <option value="earning">Earning</option>
                        <option value="deduction">Deduction</option>
                      </select>
                    </td>
                    <td><input type="number" step="0.01" class="form-control form-control-sm" [(ngModel)]="c.amount" [name]="'amount_'+i" required></td>
                    <td><button type="button" class="btn btn-soft btn-sm" style="color:var(--danger)" (click)="removeComp(i)"><i class="bi bi-x-lg"></i></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="d-flex gap-2 mb-4">
            <button type="button" class="btn btn-soft btn-sm" (click)="addComp()"><i class="bi bi-plus me-1"></i>Add Component</button>
            <button type="button" class="btn btn-soft btn-sm" (click)="loadDefaults()"><i class="bi bi-arrow-counterclockwise me-1"></i>Load Defaults</button>
          </div>

          <hr>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" [disabled]="loading || !selectedStaffId || !month || !payDate">
              <i class="bi bi-file-earmark-text me-1"></i>{{ loading ? 'Generating...' : 'Generate Payslip' }}
            </button>
            <a routerLink="/payslips" class="btn btn-outline-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PayslipGenerateComponent implements OnInit {
  staff: Staff[] = [];
  selectedStaffId = 0;
  month = '';
  payDate = '';
  components: PayslipFormComponent[] = [];
  basicPayOverride: number | null = null;
  error = '';
  success = false;
  loading = false;
  leaveSummary: { totalDays: number; paidDays: number; balance: string } | null = null;

  get selectedStaff(): Staff | undefined {
    return this.staff.find(s => s.id == this.selectedStaffId);
  }

  constructor(
    private staffService: StaffService,
    private payCompService: PayComponentService,
    private leaveService: LeaveService,
    private payslipService: PayslipService,
    private router: Router
  ) {}

  ngOnInit() {
    this.month = new Date().toISOString().substring(0, 7);
    this.payDate = new Date().toISOString().substring(0, 10);
    this.staffService.getAll().subscribe(s => this.staff = s);
    this.addComp();
  }

  addComp() {
    this.components.push({ name: '', type: 'earning', amount: 0 });
  }

  removeComp(i: number) {
    this.components.splice(i, 1);
  }

  loadDefaults() {
    this.payCompService.getAll().subscribe(comps => {
      this.components = comps.map(c => ({
        name: c.name,
        type: c.type,
        amount: c.default_amount || 0,
      }));
    });
  }

  onStaffChange() {
    this.basicPayOverride = this.selectedStaff?.basic_pay || 0;
    
    if (this.selectedStaff && this.selectedStaff.pay_components) {
      this.components = this.selectedStaff.pay_components.map((pc: any) => ({
        name: pc.name,
        type: pc.type,
        amount: parseFloat(pc.pivot?.amount || pc.default_amount || '0')
      }));
    } else {
      this.components = [];
    }
    
    if (!this.selectedStaffId || !this.month) { this.leaveSummary = null; return; }
    const year = parseInt(this.month.substring(0, 4));
    const monthNum = parseInt(this.month.substring(5, 7));
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    let workingDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      if (new Date(year, monthNum - 1, i).getDay() !== 0) workingDays++;
    }

    this.leaveService.getRecords(this.month, this.selectedStaffId).subscribe(records => {
      const approved = records.filter(r => r.status === 'approved');
      
      let totalDays = 0;
      approved.forEach(r => {
        const start = new Date(r.from_date);
        const end = new Date(r.to_date);
        const monthStart = new Date(year, monthNum - 1, 1);
        const monthEnd = new Date(year, monthNum, 0);
        
        let current = start < monthStart ? new Date(monthStart) : new Date(start);
        const actualEnd = end > monthEnd ? new Date(monthEnd) : new Date(end);
        
        while (current <= actualEnd) {
          if (current.getDay() !== 0) totalDays++;
          current.setDate(current.getDate() + 1);
        }
      });
      
      const paidDays = Math.max(0, workingDays - totalDays);

      this.leaveService.getStaffBalances(this.selectedStaffId, year).subscribe(balances => {
        let totalAvail = 0;
        balances.forEach(b => {
          totalAvail += (b.available ?? (b.total - b.used));
        });
        this.leaveSummary = { totalDays, paidDays, balance: `${totalAvail} days` };
      });
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = false;

    const data = {
      staff_id: this.selectedStaffId,
      month: this.month,
      pay_date: this.payDate,
      basic_pay: this.basicPayOverride,
      components: this.components.filter(c => c.name && c.amount >= 0),
    };

    this.payslipService.generate(data).subscribe({
      next: () => { this.success = true; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Generation failed'; this.loading = false; },
    });
  }
}
