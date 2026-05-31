export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Staff {
  id: number;
  name: string;
  emp_code: string;
  basic_pay: number;
  designation: string | null;
  department: string | null;
  joining_date: string | null;
  is_active: boolean;
  pan: string | null;
  aadhar: string | null;
  bank_account_no: string | null;
  bank_name: string | null;
  ifsc_code: string | null;
  personal_phone: string | null;
  office_phone: string | null;
  personal_email: string | null;
  official_email: string | null;
  address: string | null;
  leave_balances?: LeaveBalance[];
  pay_components?: any[];
  created_at: string;
  updated_at: string;
}

export interface PayComponent {
  id: number;
  name: string;
  type: 'earning' | 'deduction';
  default_amount: number | null;
  is_active: boolean;
  created_at: string;
}

export interface LeaveBalance {
  id: number;
  staff_id: number;
  leave_type: string;
  total: number;
  used: number;
  year: number;
  available?: number;
}

export interface PayslipComponent {
  id: number;
  payslip_id: number;
  component_name: string;
  type: 'earning' | 'deduction';
  amount: number;
}

export interface Payslip {
  id: number;
  staff_id: number;
  month: string;
  pay_date?: string;
  basic_pay: number;
  gross_earnings: number;
  total_deductions: number;
  net_pay: number;
  casual_leaves_taken: number;
  medical_leaves_taken: number;
  other_leaves_taken?: number;
  paid_days: number;
  generated_by: number;
  staff?: Staff;
  components?: PayslipComponent[];
  generator?: User;
  created_at: string;
}

export interface LeaveRecord {
  id: number;
  staff_id: number;
  leave_type: string;
  from_date: string;
  to_date: string;
  reason: string | null;
  status: 'pending' | 'approved';
  staff?: Staff;
  days?: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  totalStaff: number;
  activeStaff: number;
  totalSalary: number;
  totalPayslips: number;
  monthPayslips: number;
  totalLeaveThisMonth: number;
  recentPayslips: Payslip[];
}

export interface PayslipFormComponent {
  name: string;
  type: 'earning' | 'deduction';
  amount: number;
}

export interface MonthlyReport {
  month: string;
  total: number;
  total_net: number;
  total_gross: number;
  total_deductions: number;
}

export interface StaffReport {
  id: number;
  name: string;
  emp_code: string;
  total_payslips: number;
  total_net_pay: number;
  last_payslip: string | null;
}

export interface DateRangeReport {
  payslips: Payslip[];
  summary: {
    total_payslips: number;
    total_gross: number;
    total_deductions: number;
    total_net: number;
  };
}
