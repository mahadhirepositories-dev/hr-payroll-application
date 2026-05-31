# HR Payroll System

Full-stack HR payroll application with Angular frontend and Laravel API backend.

## Tech Stack
- **Frontend:** Angular 20 (Standalone Components, Bootstrap 5)
- **Backend:** Laravel 11 API (Sanctum Auth, DomPDF)
- **Database:** MySQL

## Features
- Authentication (Register/Login)
- Staff Management (CRUD)
- Leave Balances (Casual & Medical)
- Dynamic Pay Components (Earnings & Deductions)
- Monthly Payslip Generation
- PDF Payslip with Company Logo
- Track Record / History

## Prerequisites
- Node.js 18+
- PHP 8.1+
- Composer
- MySQL

## Setup

### 1. Database
Create a MySQL database named `hr_payroll`:
```sql
CREATE DATABASE hr_payroll;
```

### 2. Backend
```bash
cd backend
composer install
copy .env.example .env   # Edit DB credentials
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### 3. Frontend
```bash
cd frontend
npm install
ng serve
```

### 4. Login
Open http://localhost:4200
- **Email:** admin@hr.com
- **Password:** password

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | Login |
| POST | /api/register | Register |
| GET | /api/dashboard | Dashboard stats |
| GET/POST/PUT/DELETE | /api/staff | Staff CRUD |
| GET/POST/PUT/DELETE | /api/pay-components | Pay components CRUD |
| GET | /api/leaves/balances | Leave balances |
| PUT | /api/leaves/balance | Update leave balance |
| POST | /api/payslips/generate | Generate payslip |
| GET | /api/payslips | List payslips |
| GET | /api/payslips/{id}/download | Download PDF |
| GET/POST | /api/settings | Company settings |
| POST | /api/settings/logo | Upload logo |

## Project Structure
```
HR Application/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # API controllers
│   │   └── Models/                  # Eloquent models
│   ├── database/migrations/        # DB migrations
│   ├── resources/views/payslips/   # PDF template
│   └── routes/api.php              # API routes
├── frontend/                # Angular app
│   ├── src/app/
│   │   ├── auth/            # Login/Register
│   │   ├── dashboard/       # Dashboard
│   │   ├── staff/           # Staff management
│   │   ├── leaves/          # Leave balances
│   │   ├── pay-components/  # Pay components
│   │   ├── payslips/        # Payslip gen & list
│   │   ├── settings/        # Company settings
│   │   ├── services/        # HTTP services
│   │   ├── models/          # TypeScript interfaces
│   │   ├── guards/          # Auth guard
│   │   └── interceptors/    # HTTP interceptor
│   └── ...
└── setup.bat
```
