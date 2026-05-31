import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../services/setting.service';
import { LeaveTypeService, LeaveType } from '../services/leave-type.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  template: `
    <div class="page-header">
      <h4>Settings</h4>
      <span class="text-muted">Manage company profile and branding</span>
    </div>
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="fw-semibold mb-3"><i class="bi bi-building me-2" style="color:var(--primary)"></i>Company Information</h6>
            <div *ngIf="msg" class="alert alert-success py-2"><i class="bi bi-check-circle me-1"></i>{{ msg }}</div>
            <form (ngSubmit)="saveSettings()">
              <div class="mb-3">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" [(ngModel)]="companyName" name="company_name" placeholder="Mahadhi Technologies Pvt Ltd">
              </div>
              <div class="mb-3">
                <label class="form-label">Address</label>
                <textarea class="form-control" rows="3" [(ngModel)]="companyAddress" name="company_address" placeholder="Company address"></textarea>
              </div>
              <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg me-1"></i>Save</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="fw-semibold mb-3"><i class="bi bi-image me-2" style="color:var(--primary)"></i>Company Logo</h6>
            <div *ngIf="logoUrl" class="mb-3 p-3 rounded" style="background:var(--bg);text-align:center">
              <img [src]="logoUrl" style="max-height:100px" class="rounded">
            </div>
            <p class="text-muted mb-3" style="font-size:0.8125rem">Upload your company logo. It will appear on the login screen and payslip PDFs.</p>
            <div *ngIf="logoMsg" class="alert alert-success py-2"><i class="bi bi-check-circle me-1"></i>{{ logoMsg }}</div>
            <input type="file" class="form-control mb-2" (change)="onFileSelected($event)" accept="image/*">
            <button class="btn btn-primary" (click)="uploadLogo()" [disabled]="!selectedFile"><i class="bi bi-upload me-1"></i>Upload Logo</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row g-4 mt-1">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h6 class="fw-semibold mb-3"><i class="bi bi-calendar-range me-2" style="color:var(--primary)"></i>Leave Types Master</h6>
            <div class="table-responsive mb-3">
              <table class="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Default Days / Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let lt of leaveTypes; let i = index">
                    <td>
                      <input type="text" class="form-control form-control-sm" [(ngModel)]="lt.name" *ngIf="editIndex === i">
                      <span *ngIf="editIndex !== i">{{ lt.name }}</span>
                    </td>
                    <td>
                      <input type="number" class="form-control form-control-sm" [(ngModel)]="lt.default_days" *ngIf="editIndex === i">
                      <span *ngIf="editIndex !== i">{{ lt.default_days }}</span>
                    </td>
                    <td>
                      <div class="form-check form-switch" *ngIf="editIndex === i">
                        <input class="form-check-input" type="checkbox" [(ngModel)]="lt.is_active">
                      </div>
                      <span class="badge bg-success" *ngIf="editIndex !== i && lt.is_active">Active</span>
                      <span class="badge bg-danger" *ngIf="editIndex !== i && !lt.is_active">Inactive</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary me-1" *ngIf="editIndex === i" (click)="saveLeaveType(i)">Save</button>
                      <button class="btn btn-sm btn-light" *ngIf="editIndex === i" (click)="cancelEdit()">Cancel</button>
                      <button class="btn btn-sm btn-light me-1" *ngIf="editIndex !== i" (click)="startEdit(i)"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-light text-danger" *ngIf="editIndex !== i" (click)="deleteLeaveType(lt.id!)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button class="btn btn-sm btn-outline-primary" (click)="addLeaveType()"><i class="bi bi-plus me-1"></i>Add Leave Type</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  companyName = 'Mahadhi Technologies Pvt Ltd';
  companyAddress = '';
  logoUrl = '';
  selectedFile: File | null = null;
  msg = '';
  logoMsg = '';

  leaveTypes: LeaveType[] = [];
  editIndex: number = -1;

  constructor(private service: SettingService, private leaveTypeService: LeaveTypeService) {}

  ngOnInit() {
    this.service.getSettings().subscribe(s => {
      if (s['company_name']) this.companyName = s['company_name'];
      if (s['company_address']) this.companyAddress = s['company_address'];
    });
    this.service.getLogo().subscribe((r: any) => {
      if (r?.url) this.logoUrl = r.url;
    });
    this.loadLeaveTypes();
  }

  saveSettings() {
    this.service.updateSettings({ company_name: this.companyName, company_address: this.companyAddress })
      .subscribe(() => { this.msg = 'Saved!'; setTimeout(() => this.msg = '', 2000); });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  uploadLogo() {
    if (!this.selectedFile) return;
    this.service.uploadLogo(this.selectedFile).subscribe((r: any) => {
      this.logoUrl = r.url;
      this.logoMsg = 'Logo uploaded!';
      setTimeout(() => this.logoMsg = '', 2000);
    });
  }

  loadLeaveTypes() {
    this.leaveTypeService.getAll().subscribe(res => this.leaveTypes = res);
  }

  addLeaveType() {
    if (this.editIndex !== -1) return;
    this.leaveTypes.push({ name: '', default_days: 0, is_active: true });
    this.editIndex = this.leaveTypes.length - 1;
  }

  startEdit(index: number) {
    this.editIndex = index;
  }

  cancelEdit() {
    this.editIndex = -1;
    this.loadLeaveTypes();
  }

  saveLeaveType(index: number) {
    const lt = this.leaveTypes[index];
    if (lt.id) {
      this.leaveTypeService.update(lt.id, lt).subscribe(() => {
        this.editIndex = -1;
        this.loadLeaveTypes();
      });
    } else {
      this.leaveTypeService.create(lt).subscribe(() => {
        this.editIndex = -1;
        this.loadLeaveTypes();
      });
    }
  }

  deleteLeaveType(id: number) {
    if (confirm('Are you sure you want to delete this leave type?')) {
      this.leaveTypeService.delete(id).subscribe(() => this.loadLeaveTypes());
    }
  }
}
