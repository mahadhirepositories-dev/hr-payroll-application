<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payslip;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function monthly(): JsonResponse
    {
        $reports = Payslip::selectRaw('month, count(*) as total, sum(net_pay) as total_net, sum(gross_earnings) as total_gross, sum(total_deductions) as total_deductions')
            ->groupBy('month')
            ->orderByDesc('month')
            ->get();

        return response()->json($reports);
    }

    public function staffWise(): JsonResponse
    {
        $staff = Staff::with(['payslips' => fn($q) => $q->orderByDesc('month')])->get();
        $data = $staff->map(fn($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'emp_code' => $s->emp_code,
            'total_payslips' => $s->payslips->count(),
            'total_net_pay' => $s->payslips->sum('net_pay'),
            'last_payslip' => $s->payslips->first()?->month,
        ]);

        return response()->json($data);
    }

    public function dateRange(Request $request): JsonResponse
    {
        $request->validate([
            'from' => 'required|date_format:Y-m',
            'to' => 'required|date_format:Y-m|after_or_equal:from',
        ]);

        $payslips = Payslip::with('staff')
            ->where('month', '>=', $request->from)
            ->where('month', '<=', $request->to)
            ->orderBy('month')
            ->orderBy('staff_id')
            ->get();

        $summary = [
            'total_payslips' => $payslips->count(),
            'total_gross' => $payslips->sum('gross_earnings'),
            'total_deductions' => $payslips->sum('total_deductions'),
            'total_net' => $payslips->sum('net_pay'),
        ];

        return response()->json(['payslips' => $payslips, 'summary' => $summary]);
    }
}
