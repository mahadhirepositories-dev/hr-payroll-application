<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\LeaveTypeController;
use App\Http\Controllers\Api\PayComponentController;
use App\Http\Controllers\Api\PayslipController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StaffController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Public settings for login/register pages
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/logo', [SettingController::class, 'getLogo']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [SettingController::class, 'dashboard']);
    Route::apiResource('staff', StaffController::class);
    Route::get('/leaves/balances', [LeaveController::class, 'balances']);
    Route::get('/leaves/staff/{staff}/{year}', [LeaveController::class, 'staffBalances']);
    Route::put('/leaves/balance', [LeaveController::class, 'updateBalance']);
    Route::get('/leaves/records', [LeaveController::class, 'records']);
    Route::post('/leaves/records', [LeaveController::class, 'storeRecord']);
    Route::put('/leaves/records/{leaveRecord}', [LeaveController::class, 'updateRecord']);
    Route::delete('/leaves/records/{leaveRecord}', [LeaveController::class, 'deleteRecord']);
    Route::apiResource('pay-components', PayComponentController::class);
    Route::apiResource('leave-types', LeaveTypeController::class);
    Route::get('/payslips', [PayslipController::class, 'index']);
    Route::post('/payslips/generate', [PayslipController::class, 'generate']);
    Route::get('/payslips/{payslip}', [PayslipController::class, 'show']);
    Route::get('/payslips/{payslip}/download', [PayslipController::class, 'downloadPdf']);
    Route::post('/payslips/{payslip}/email', [PayslipController::class, 'sendEmail']);
    Route::post('/settings', [SettingController::class, 'update']);
    Route::post('/settings/logo', [SettingController::class, 'uploadLogo']);
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);
    Route::get('/reports/staff-wise', [ReportController::class, 'staffWise']);
    Route::post('/reports/date-range', [ReportController::class, 'dateRange']);
});
