# ZopaPro HR & Payroll Application

A modern, full-stack Human Resources and Payroll Management System built to streamline employee tracking, leave management, and automated payslip generation.

## 🌟 Key Features

### 👥 Employee Management
* Maintain detailed staff records including personal information, contact details, and employment status.
* Easily toggle active/inactive status for employees.
* Track base salary and assign custom pay components.

### 🏖️ Leave & Attendance Management
* **Leave Types Master:** Configure custom leave types (e.g., Earned Leave, Medical Leave) with default annual allowances.
* **Leave Balances:** Automatically track how many days each employee has taken and how many they have remaining.
* **Leave Records:** Log specific leave dates and durations.

### 💰 Payroll & Compensation
* **Dynamic Pay Components:** Create flexible Earnings and Deductions (e.g., Basic Pay, HRA, PF, Tax).
* **Component Mapping:** Assign specific pay components to individual employees.
* **Automated Calculations:** Generate monthly payslips with automatic calculation of Gross Earnings, Total Deductions, and Net Pay based on leave taken and assigned components.

### 📄 Payslip Generation & Distribution
* **PDF Generation:** Download beautifully formatted, professional payslips in PDF format.
* **Email Integration:** Send payslips directly to employees' inboxes with a single click.
* **Company Branding:** Dynamically injects company logo, name, and address into all generated payslips.

### 📊 Dashboard & Analytics
* Get an instant overview of your organization's health.
* Track total active staff, total payroll expenditures for the current month, and recent payslip history.

### ⚙️ System Settings
* Global configuration for Company Name, Address, and Logo.
* Uploaded logos automatically sync across the login screen, dashboard, and exported PDFs.

## 🛠️ Technology Stack

* **Frontend:** Angular 17 (Standalone Components), RxJS
* **Backend:** Laravel 11 (PHP 8.2+)
* **Database:** MySQL / SQLite
* **Authentication:** Laravel Sanctum (Token-based SPA Authentication)
* **Styling:** Custom CSS with modern UI/UX principles (Glassmorphism, clean typography)
* **PDF Engine:** Barryvdh/Laravel-DomPDF

## 🚀 Deployment

This application includes a custom build script (`scripts/build-and-package.ps1`) designed specifically to compile and package the application for shared hosting environments (like Hostinger). 

The script automatically:
1. Builds the Angular frontend for production.
2. Packages the Laravel backend.
3. Generates specialized `.htaccess` and `index.php` routing patches to bypass strict shared-hosting symlink and routing restrictions.
4. Outputs a ready-to-deploy `.zip` archive.
