import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SettingService } from './services/setting.service';
import { StaffService } from './services/staff.service';
import { Staff } from './models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgFor, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  isLoggedIn = false;
  sidebarCollapsed = false;
  userName = '';
  companyName = 'Mahadhi';
  companyLogo = '';
  private routerSub!: Subscription;
  
  // Search properties
  searchQuery = '';
  allStaff: Staff[] = [];
  searchResults: Staff[] = [];

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid' },
    { path: '/staff', label: 'Employee', icon: 'bi-people' },
    { path: '/leaves', label: 'Leave', icon: 'bi-door-open' },
    { path: '/pay-components', label: 'Pay Components', icon: 'bi-cash-stack' },
    { path: '/payslips', label: 'Payroll', icon: 'bi-wallet2' },
    { path: '/reports', label: 'Reports', icon: 'bi-bar-chart' },
    { path: '/settings', label: 'Settings', icon: 'bi-gear' },
  ];

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private settings: SettingService,
    private staffService: StaffService,
    private eRef: ElementRef
  ) {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const loggedIn = this.auth.isLoggedIn();
      if (loggedIn && !this.isLoggedIn) {
        this.isLoggedIn = true;
        this.fetchData();
      } else if (!loggedIn && this.isLoggedIn) {
        this.isLoggedIn = false;
      }
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    if (this.isLoggedIn) {
      this.fetchData();
    }
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  fetchData() {
    this.auth.getUser().subscribe({
      next: (u) => this.userName = u.name,
      error: () => this.userName = 'Admin',
    });
    this.settings.getSettings().subscribe(s => {
      if (s['company_name']) this.companyName = s['company_name'];
    });
    this.settings.getLogo().subscribe((r: any) => {
      if (r?.url) this.companyLogo = r.url;
    });
    this.staffService.getAll().subscribe(s => this.allStaff = s);
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.searchResults = this.allStaff.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.emp_code.toLowerCase().includes(q)
    ).slice(0, 5); // show top 5
  }

  selectSearchResult(staff: Staff) {
    this.searchQuery = '';
    this.searchResults = [];
    this.router.navigate(['/staff', staff.id, 'edit']);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.searchResults = [];
    }
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
    });
  }
}
