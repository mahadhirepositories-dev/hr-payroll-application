<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRecord;
use App\Models\Payslip;
use App\Models\Setting;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');
        if (!$settings->has('company_name')) {
            $settings['company_name'] = 'Mahadhi Technologies Pvt Ltd';
        }
        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string',
        ]);

        if ($request->has('company_name')) Setting::setValue('company_name', $request->company_name);
        if ($request->has('company_address')) Setting::setValue('company_address', $request->company_address);

        return response()->json(['message' => 'Settings updated']);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate(['logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048']);
        $path = $request->file('logo')->store('logos', 'public');
        Setting::setValue('logo_path', $path);
        return response()->json(['path' => $path, 'url' => Storage::disk('public')->url($path)]);
    }

    public function getLogo(): JsonResponse
    {
        $path = Setting::getValue('logo_path');
        if (!$path || !Storage::disk('public')->exists($path)) return response()->json(null);
        return response()->json(['url' => Storage::disk('public')->url($path)]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $monthStr = $request->query('month');
        $date = $monthStr ? \Carbon\Carbon::parse($monthStr . '-01') : now();
        
        $totalStaff = Staff::count();
        $activeStaff = Staff::where('is_active', true)->count();
        $currentMonth = $date->format('Y-m');
        $totalSalary = Payslip::where('month', $currentMonth)->sum('net_pay');
        $currentMonth = $date->format('Y-m');
        $totalPayslips = Payslip::count();
        $monthPayslips = Payslip::where('month', $currentMonth)->count();

        $start = $date->format('Y-m-01');
        $end = $date->format('Y-m-t');

        $totalLeaveThisMonth = LeaveRecord::where('from_date', '<=', $end)
            ->where('to_date', '>=', $start)
            ->get()
            ->sum('days');

        $recentPayslips = Payslip::with('staff')->orderByDesc('created_at')->limit(5)->get();

        return response()->json(compact(
            'totalStaff', 'activeStaff', 'totalSalary', 'totalPayslips',
            'monthPayslips', 'totalLeaveThisMonth', 'recentPayslips'
        ));
    }
}
