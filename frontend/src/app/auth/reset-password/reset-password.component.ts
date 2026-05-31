import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SettingService } from '../../services/setting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
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
          <h4 class="fw-bold mt-2" style="color:var(--text-primary)">Reset Password</h4>
          <p class="text-muted" style="font-size:0.875rem;margin-top:0.5rem">Enter your new password below.</p>
        </div>
        <div *ngIf="error" class="alert alert-danger py-2" style="font-size: 0.85rem">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success py-2" style="font-size: 0.85rem">{{ success }}</div>
        
        <form (ngSubmit)="onSubmit()" *ngIf="!success">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required readonly class="bg-light">
          </div>
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required placeholder="Enter new password">
          </div>
          <div class="mb-3">
            <label class="form-label">Confirm Password</label>
            <input type="password" class="form-control" [(ngModel)]="password_confirmation" name="password_confirmation" required placeholder="Confirm new password">
          </div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading || !password || !password_confirmation">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
        <div class="text-center mt-3 mb-0" *ngIf="success">
          <a routerLink="/login" class="btn btn-primary w-100">Proceed to Login</a>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  password = '';
  password_confirmation = '';
  
  error = '';
  success = '';
  loading = false;
  logoUrl = '';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private settingService: SettingService,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    this.settingService.getLogo().subscribe((r: any) => {
      if (r?.url) this.logoUrl = r.url;
    });
  }

  onSubmit() {
    if (this.password !== this.password_confirmation) {
      this.error = "Passwords do not match!";
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.auth.resetPassword({
      token: this.token,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    }).subscribe({
      next: (res) => {
        this.success = res.message || 'Your password has been reset successfully!';
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.email || err.error?.message || 'Failed to reset password.';
        this.loading = false;
      },
    });
  }
}
