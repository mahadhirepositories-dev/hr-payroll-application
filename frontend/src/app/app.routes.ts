import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffListComponent } from './staff/staff-list.component';
import { StaffFormComponent } from './staff/staff-form/staff-form.component';
import { LeavesComponent } from './leaves/leaves.component';
import { PayComponentsComponent } from './pay-components/pay-components.component';
import { PayslipListComponent } from './payslips/payslip-list.component';
import { PayslipGenerateComponent } from './payslips/payslip-generate.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'staff', component: StaffListComponent, canActivate: [AuthGuard] },
  { path: 'staff/new', component: StaffFormComponent, canActivate: [AuthGuard] },
  { path: 'staff/:id/edit', component: StaffFormComponent, canActivate: [AuthGuard] },
  { path: 'leaves', component: LeavesComponent, canActivate: [AuthGuard] },
  { path: 'pay-components', component: PayComponentsComponent, canActivate: [AuthGuard] },
  { path: 'payslips', component: PayslipListComponent, canActivate: [AuthGuard] },
  { path: 'payslips/generate', component: PayslipGenerateComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
