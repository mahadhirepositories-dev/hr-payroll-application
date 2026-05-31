import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SettingService } from '../../services/setting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
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
          <h4 class="fw-bold mt-2" style="color:var(--text-primary)" *ngIf="!logoUrl">{{ companyName }}</h4>
          <p class="text-muted" style="font-size:0.8125rem" *ngIf="companyAddress && !logoUrl">{{ companyAddress }}</p>
          <p class="text-muted" style="font-size:0.875rem;margin-top:0.5rem">Sign in to your account</p>
        </div>
        <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
        <form (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="admin@hr.com">
          </div>
          <div class="mb-2">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required placeholder="Enter password">
          </div>
          <div class="d-flex justify-content-end mb-3">
            <a routerLink="/forgot-password" style="font-size:0.8125rem;color:var(--primary);text-decoration:none;font-weight:500">Forgot Password?</a>
          </div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;
  companyName = 'Mahadhi Technologies Pvt Ltd';
  companyAddress = '';
  logoUrl = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private settingService: SettingService,
  ) {}

  ngOnInit() {
    this.settingService.getSettings().subscribe(s => {
      if (s['company_name']) this.companyName = s['company_name'];
      if (s['company_address']) this.companyAddress = s['company_address'];
    });
    this.settingService.getLogo().subscribe((r: any) => {
      if (r?.url) this.logoUrl = r.url;
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Invalid credentials';
        this.loading = false;
      },
    });
  }
}
