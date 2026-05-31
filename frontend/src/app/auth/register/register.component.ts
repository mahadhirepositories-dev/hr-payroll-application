import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  template: `
    <div class="d-flex align-items-center justify-content-center" style="min-height:100vh;background:var(--bg)">
      <div class="card" style="width:400px;padding:2rem">
        <div class="text-center mb-4">
          <i class="bi bi-hexagon-fill" style="font-size:2.5rem;color:var(--primary)"></i>
          <h4 class="fw-bold mt-2" style="color:var(--text-primary)">Elevnest</h4>
          <p class="text-muted" style="font-size:0.875rem">Create your account</p>
        </div>
        <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
        <form (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" [(ngModel)]="name" name="name" required placeholder="Full name">
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="you@company.com">
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required minlength="8" placeholder="Min 8 characters">
          </div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0" style="font-size:0.8125rem">
          Already have an account? <a routerLink="/login" style="color:var(--primary);text-decoration:none;font-weight:500">Sign In</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
