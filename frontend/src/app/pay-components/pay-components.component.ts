import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayComponentService } from '../services/pay-component.service';
import { PayComponent } from '../models/models';

@Component({
  selector: 'app-pay-components',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  template: `
    <div class="page-header">
      <h4>Pay Components</h4>
      <span class="text-muted">Manage earnings and deductions</span>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <h6 class="fw-semibold mb-3"><i class="bi bi-plus-circle me-2" style="color:var(--primary)"></i>Add New Component</h6>
        <div class="row g-2 align-items-end">
          <div class="col">
            <label class="form-label">Component Name</label>
            <input type="text" class="form-control" placeholder="e.g. HRA, Bonus" [(ngModel)]="newComp.name">
          </div>
          <div class="col-auto">
            <label class="form-label">Type</label>
            <select class="form-select" [(ngModel)]="newComp.type">
              <option value="earning">Earning</option>
              <option value="deduction">Deduction</option>
            </select>
          </div>
          <div class="col">
            <label class="form-label">Default Amount</label>
            <input type="number" class="form-control" placeholder="0.00" [(ngModel)]="newComp.default_amount">
          </div>
          <div class="col-auto">
            <button class="btn btn-primary" (click)="add()" [disabled]="!newComp.name"><i class="bi bi-plus-lg me-1"></i>Add</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of components">
              <td class="fw-medium">{{ c.name }}</td>
              <td>
                <span class="badge" [class.badge-success]="c.type==='earning'" [class.badge-danger]="c.type==='deduction'">
                  {{ c.type === 'earning' ? 'Earning' : 'Deduction' }}
                </span>
              </td>
              <td>{{ c.default_amount ? '&#8377; ' + c.default_amount : '-' }}</td>
              <td><button class="btn btn-soft btn-sm" style="color:var(--danger)" (click)="delete(c)"><i class="bi bi-trash"></i></button></td>
            </tr>
            <tr *ngIf="!components.length"><td colspan="4" class="text-center text-muted py-4">No components</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PayComponentsComponent implements OnInit {
  components: PayComponent[] = [];
  newComp: Partial<PayComponent> = { name: '', type: 'earning', default_amount: null };

  constructor(private service: PayComponentService) {}

  ngOnInit() { this.load(); }

  load() { this.service.getAll().subscribe(c => this.components = c); }

  add() {
    this.service.create(this.newComp).subscribe(() => {
      this.newComp = { name: '', type: 'earning', default_amount: null };
      this.load();
    });
  }

  delete(c: PayComponent) {
    if (confirm(`Delete "${c.name}"?`)) {
      this.service.delete(c.id).subscribe(() => this.load());
    }
  }
}
