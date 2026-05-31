<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRecord;
use App\Models\Payslip;
use App\Models\Setting;
use App\Models\Staff;
use App\Mail\PayslipMail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;

class PayslipController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Payslip::with(['staff', 'components', 'generator'])->orderByDesc('created_at')->get()
        );
    }

    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'month' => 'required|date_format:Y-m',
            'pay_date' => 'required|date_format:Y-m-d',
            'basic_pay' => 'nullable|numeric|min:0',
            'components' => 'nullable|array',
            'components.*.name' => 'required|string',
            'components.*.type' => 'required|in:earning,deduction',
            'components.*.amount' => 'required|numeric|min:0',
        ]);

        $staff = Staff::findOrFail($request->staff_id);
        $year = (int) substr($request->month, 0, 4);
        $monthNum = (int) substr($request->month, 5, 2);
        $daysInMonth = now()->setYear($year)->setMonth($monthNum)->daysInMonth;

        $workingDays = 0;
        for ($i = 1; $i <= $daysInMonth; $i++) {
            if (!now()->setYear($year)->setMonth($monthNum)->setDay($i)->isSunday()) {
                $workingDays++;
            }
        }

        // Auto-calculate leave days from leave_records for this month
        $leaveRecords = LeaveRecord::where('staff_id', $staff->id)
            ->where('status', 'approved')
            ->whereYear('from_date', $year)
            ->whereMonth('from_date', $monthNum)
            ->get();

        $totalLeaveDays = 0;
        $casualLeaveDays = 0;
        $medicalLeaveDays = 0;
        $otherLeaveDays = 0;

        foreach ($leaveRecords as $lr) {
            $start = max($lr->from_date, now()->setYear($year)->setMonth($monthNum)->startOfMonth());
            $end = min($lr->to_date, now()->setYear($year)->setMonth($monthNum)->endOfMonth());
            
            $current = clone $start;
            while ($current->lte($end)) {
                if (!$current->isSunday()) {
                    $totalLeaveDays++;
                    if (strtolower($lr->leave_type) === 'casual') $casualLeaveDays++;
                    elseif (strtolower($lr->leave_type) === 'medical') $medicalLeaveDays++;
                    else $otherLeaveDays++;
                }
                $current->addDay();
            }
        }

        $paidDays = max(0, $workingDays - $totalLeaveDays);

        $basicPay = $request->has('basic_pay') && $request->basic_pay !== null ? (float)$request->basic_pay : (float)$staff->basic_pay;
        $grossEarnings = $basicPay;
        $totalDeductions = 0;

        if ($request->has('components') && is_array($request->components)) {
            foreach ($request->components as $comp) {
                if ($comp['type'] === 'earning') $grossEarnings += $comp['amount'];
                else $totalDeductions += $comp['amount'];
            }
        }

        $payslip = Payslip::create([
            'staff_id' => $staff->id,
            'month' => $request->month,
            'pay_date' => $request->pay_date,
            'basic_pay' => $basicPay,
            'gross_earnings' => $grossEarnings,
            'total_deductions' => $totalDeductions,
            'net_pay' => $grossEarnings - $totalDeductions,
            'casual_leaves_taken' => $casualLeaveDays,
            'medical_leaves_taken' => $medicalLeaveDays,
            'other_leaves_taken' => $otherLeaveDays,
            'paid_days' => $paidDays,
            'generated_by' => $request->user()->id,
        ]);

        foreach ($request->components as $comp) {
            $payslip->components()->create([
                'component_name' => $comp['name'],
                'type' => $comp['type'],
                'amount' => $comp['amount'],
            ]);
        }

        $payslip->load(['staff', 'components', 'generator']);
        return response()->json($payslip, 201);
    }

    public function show(Payslip $payslip): JsonResponse
    {
        return response()->json($payslip->load(['staff', 'components', 'generator']));
    }

    public function downloadPdf(Payslip $payslip)
    {
        $payslip->load(['staff', 'components', 'generator']);
        $companyName = Setting::getValue('company_name', 'Mahadhi Technologies Pvt Ltd');
        $companyAddress = Setting::getValue('company_address', '');
        $logoPath = Setting::getValue('logo_path');

        $logoBase64 = null;
        if ($logoPath && Storage::disk('public')->exists($logoPath)) {
            $logoBase64 = base64_encode(Storage::disk('public')->get($logoPath));
        }

        $earnings = $payslip->components->where('type', 'earning');
        $deductions = $payslip->components->where('type', 'deduction');

        $pdf = Pdf::loadView('payslips.pdf', compact(
            'payslip', 'companyName', 'companyAddress', 'logoBase64', 'earnings', 'deductions'
        ));

        return $pdf->download("payslip_{$payslip->staff->emp_code}_{$payslip->month}.pdf");
    }

    public function sendEmail(Payslip $payslip): JsonResponse
    {
        $payslip->load(['staff', 'components', 'generator']);
        
        $email = $payslip->staff->official_email ?: $payslip->staff->personal_email;
        
        if (!$email) {
            return response()->json(['message' => 'Staff member has no email address configured.'], 400);
        }

        $companyName = Setting::getValue('company_name', 'Mahadhi Technologies Pvt Ltd');
        $companyAddress = Setting::getValue('company_address', '');
        $logoPath = Setting::getValue('logo_path');

        $logoBase64 = null;
        if ($logoPath && Storage::disk('public')->exists($logoPath)) {
            $logoBase64 = base64_encode(Storage::disk('public')->get($logoPath));
        }

        $earnings = $payslip->components->where('type', 'earning');
        $deductions = $payslip->components->where('type', 'deduction');

        $pdf = Pdf::loadView('payslips.pdf', compact(
            'payslip', 'companyName', 'companyAddress', 'logoBase64', 'earnings', 'deductions'
        ));
        
        $pdfContent = $pdf->output();
        $pdfName = "payslip_{$payslip->staff->emp_code}_{$payslip->month}.pdf";

        Mail::to($email)->cc('rajashyam@zopapro.com')->send(new PayslipMail($payslip, $pdfContent, $pdfName));

        return response()->json(['message' => 'Payslip emailed successfully!']);
    }
}
