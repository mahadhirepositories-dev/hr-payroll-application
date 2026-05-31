import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SettingService } from '../../services/setting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center" style="min-height:100vh;background:var(--bg)">
      <div class="card" style="width:420px;padding:2.5rem">
        <div class="text-center mb-4">
          <div *ngIf="logoUrl; else logoPlaceholder" class="mb-3">
            <img [src]="logoUrl" style="max-height:60px" class="img-fluid">
          </div>
          <ng-template #logoPlaceholder>
            <i class="bi bi-hexagon-fill" style="font-size:2.5rem;color:var(--primary)"></i>
          </ng-template>
          <h4 class="fw-bold mt-2" style="color:var(--text-primary)">Forgot Password</h4>
          <p class="text-muted" style="font-size:0.875rem;margin-top:0.5rem">Enter your email address and we will send you a password reset link.</p>
        </div>
        <div *ngIf="error" class="alert alert-danger py-2" style="font-size: 0.85rem">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success py-2" style="font-size: 0.85rem">{{ success }}</div>
        
        <form (ngSubmit)="onSubmit()" *ngIf="!success">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="admin@hr.com">
          </div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading || !email">
            {{ loading ? 'Sending link...' : 'Send Password Reset Link' }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0" style="font-size:0.8125rem">
          Remembered your password? <a routerLink="/login" style="color:var(--primary);text-decoration:none;font-weight:500">Back to Login</a>
        </p>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  error = '';
  success = '';
  loading = false;
  logoUrl = '';

  constructor(
    private auth: AuthService,
    private settingService: SettingService,
  ) {}

  ngOnInit() {
    this.settingService.getLogo().subscribe((r: any) => {
      if (r?.url) this.logoUrl = r.url;
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.success = res.message || 'We have emailed your password reset link.';
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.email || err.error?.message || 'Failed to send reset link.';
        this.loading = false;
      },
    });
  }
}
