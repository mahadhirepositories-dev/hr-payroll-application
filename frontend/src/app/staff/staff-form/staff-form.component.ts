import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { StaffService } from '../../services/staff.service';
import { PayComponentService } from '../../services/pay-component.service';
import { LeaveTypeService } from '../../services/leave-type.service';
import { Staff } from '../../models/models';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink],
  template: `
    <div class="page-header d-flex align-items-center gap-3">
      <a routerLink="/staff" class="btn btn-soft btn-sm"><i class="bi bi-arrow-left"></i></a>
      <div>
        <h4>{{ isEdit ? 'Edit' : 'Add' }} Employee</h4>
        <span class="text-muted">{{ isEdit ? 'Update employee information' : 'Register a new employee' }}</span>
      </div>
    </div>
    <div class="card" style="max-width:900px">
      <div class="card-body">
        <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
        <form (ngSubmit)="onSubmit()">
          <div class="card mb-3" style="border-color:var(--border);box-shadow:none">
            <div class="card-body">
              <h6 class="fw-semibold mb-3"><i class="bi bi-briefcase me-2" style="color:var(--primary)"></i>Employment Details</h6>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Employee Code *</label>
                  <input type="text" class="form-control" [(ngModel)]="form.emp_code" name="emp_code" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Name *</label>
                  <input type="text" class="form-control" [(ngModel)]="form.name" name="name" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Basic Pay *</label>
                  <input type="number" step="0.01" class="form-control" [(ngModel)]="form.basic_pay" name="basic_pay" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Designation</label>
                  <input type="text" class="form-control" [(ngModel)]="form.designation" name="designation">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-control" [(ngModel)]="form.department" name="department">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Joining Date</label>
                  <input type="date" class="form-control" [(ngModel)]="form.joining_date" name="joining_date">
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="card mb-3" style="border-color:var(--border);box-shadow:none">
                <div class="card-body">
                  <h6 class="fw-semibold mb-3"><i class="bi bi-list-check me-2" style="color:var(--primary)"></i>Pay Components</h6>
                  <div class="table-responsive">
                    <table class="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th style="width: 40px"></th>
                          <th>Component</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let pc of staffPayComponents">
                          <td><input type="checkbox" class="form-check-input" [(ngModel)]="pc.selected" [name]="'pc_sel_'+pc.pay_component_id"></td>
                          <td>{{ pc.name }}</td>
                          <td><input type="number" step="0.01" class="form-control form-control-sm" [(ngModel)]="pc.amount" [name]="'pc_amt_'+pc.pay_component_id" [disabled]="!pc.selected"></td>
                        </tr>
                        <tr *ngIf="staffPayComponents.length === 0">
                          <td colspan="3" class="text-muted text-center py-3">No active pay components found. Manage them in Masters.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="card mb-3" style="border-color:var(--border);box-shadow:none;height:100%">
                <div class="card-body">
                  <h6 class="fw-semibold mb-3"><i class="bi bi-calendar-range me-2" style="color:var(--primary)"></i>Leave Allocations (Days/Year)</h6>
                  <div class="row g-3">
                    <div class="col-md-6" *ngFor="let la of staffLeaveAllocations">
                      <label class="form-label mb-1" style="font-size:0.875rem">{{ la.leave_type }}</label>
                      <input type="number" class="form-control form-control-sm" [(ngModel)]="la.total" [name]="'la_'+la.leave_type">
                    </div>
                    <div *ngIf="staffLeaveAllocations.length === 0" class="col-12 text-muted text-center py-3">
                      No active leave types found. Manage them in Settings.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-3" style="border-color:var(--border);box-shadow:none">
            <div class="card-body">
              <h6 class="fw-semibold mb-3"><i class="bi bi-person me-2" style="color:var(--primary)"></i>Personal Information</h6>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">PAN</label>
                  <input type="text" class="form-control" [(ngModel)]="form.pan" name="pan">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Aadhar</label>
                  <input type="text" class="form-control" [(ngModel)]="form.aadhar" name="aadhar">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Personal Phone</label>
                  <input type="text" class="form-control" [(ngModel)]="form.personal_phone" name="personal_phone">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Office Phone</label>
                  <input type="text" class="form-control" [(ngModel)]="form.office_phone" name="office_phone">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Personal Email</label>
                  <input type="email" class="form-control" [(ngModel)]="form.personal_email" name="personal_email">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Official Email</label>
                  <input type="email" class="form-control" [(ngModel)]="form.official_email" name="official_email">
                </div>
                <div class="col-12">
                  <label class="form-label">Address</label>
                  <textarea class="form-control" rows="2" [(ngModel)]="form.address" name="address"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-3" style="border-color:var(--border);box-shadow:none">
            <div class="card-body">
              <h6 class="fw-semibold mb-3"><i class="bi bi-bank me-2" style="color:var(--primary)"></i>Bank Details</h6>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Bank Name</label>
                  <input type="text" class="form-control" [(ngModel)]="form.bank_name" name="bank_name">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Account No</label>
                  <input type="text" class="form-control" [(ngModel)]="form.bank_account_no" name="bank_account_no">
                </div>
                <div class="col-md-4">
                  <label class="form-label">IFSC Code</label>
                  <input type="text" class="form-control" [(ngModel)]="form.ifsc_code" name="ifsc_code">
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Create Employee') }}</button>
            <a routerLink="/staff" class="btn btn-outline-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class StaffFormComponent implements OnInit {
  form: Partial<Staff> = { name: '', emp_code: '', basic_pay: 0, designation: '', department: '', joining_date: '' };
  isEdit = false;
  error = '';
  loading = false;
  private id?: number;

  globalPayComponents: any[] = [];
  globalLeaveTypes: any[] = [];
  staffPayComponents: any[] = [];
  staffLeaveAllocations: any[] = [];

  constructor(
    private service: StaffService,
    private payCompService: PayComponentService,
    private leaveTypeService: LeaveTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.payCompService.getAll().subscribe(pcs => {
      this.globalPayComponents = pcs.filter(c => c.is_active);
      this.leaveTypeService.getAll().subscribe(lts => {
        this.globalLeaveTypes = lts.filter(l => l.is_active);
        this.initForm();
      });
    });
  }

  initForm() {
    if (this.id) {
      this.isEdit = true;
      this.service.get(this.id).subscribe((s: Staff) => {
        this.form = { ...s };
        this.form.joining_date = s.joining_date ? s.joining_date.substring(0, 10) : '';
        
        this.staffPayComponents = this.globalPayComponents.map(gpc => {
          const existing = s.pay_components?.find(pc => pc.id === gpc.id);
          return {
            pay_component_id: gpc.id,
            name: gpc.name,
            selected: !!existing,
            amount: existing ? parseFloat(existing.pivot.amount) : parseFloat(gpc.default_amount || '0')
          };
        });

        this.staffLeaveAllocations = this.globalLeaveTypes.map(glt => {
          const existing = s.leave_balances?.find(lb => lb.leave_type === glt.name);
          return {
            leave_type: glt.name,
            total: existing ? existing.total : glt.default_days
          };
        });
      });
    } else {
      this.staffPayComponents = this.globalPayComponents.map(gpc => ({
        pay_component_id: gpc.id,
        name: gpc.name,
        selected: true,
        amount: parseFloat(gpc.default_amount || '0')
      }));

      this.staffLeaveAllocations = this.globalLeaveTypes.map(glt => ({
        leave_type: glt.name,
        total: glt.default_days
      }));
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    const payload: any = { ...this.form };
    payload.pay_components = this.staffPayComponents.filter(c => c.selected);
    payload.leave_balances = this.staffLeaveAllocations;

    const obs = this.isEdit ? this.service.update(this.id!, payload) : this.service.create(payload);
    obs.subscribe({
      next: () => this.router.navigate(['/staff']),
      error: (err: any) => { this.error = err.error?.message || 'Save failed'; this.loading = false; },
    });
  }
}
