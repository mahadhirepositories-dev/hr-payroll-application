<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payslip - {{ $payslip->staff->name }}</title>
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { font-size: 12px; color: #333; margin: 10px 15px; line-height: 1.5; }
        .page { max-width: 190mm; margin: 0 auto; }

        .header { width: 100%; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 25px; }
        .header-table { width: 100%; border-collapse: collapse; }
        .header-table td { vertical-align: middle; }
        
        .section-title { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        
        .summary-container { display: table; width: 100%; margin-bottom: 20px; }
        .summary-left { display: table-cell; width: 50%; vertical-align: top; }
        .summary-right { display: table-cell; width: 50%; vertical-align: top; text-align: right; }

        .info-table { border-collapse: collapse; }
        .info-table td { padding: 4px 0; font-size: 12px; }
        .info-table .label { color: #6b7280; width: 160px; }
        .info-table .colon { color: #6b7280; width: 15px; }
        .info-table .value { font-weight: bold; color: #1f2937; }
        .highlight-name { background-color: #dbeafe; padding: 2px 5px; border-radius: 3px; }

        .net-pay-card { display: inline-block; width: 250px; border: 1px solid #d1d5db; border-radius: 8px; text-align: left; overflow: hidden; }
        .net-pay-card-top { background-color: #e8f5e9; padding: 15px 18px; }
        .net-pay-card-top .amount { font-size: 24px; font-weight: 700; color: #1f2937; }
        .net-pay-card-top .label { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .net-pay-card-bottom { background-color: #ffffff; padding: 12px 18px; border-top: 1px solid #d1d5db; }
        
        .card-info-table { width: 100%; border-collapse: collapse; }
        .card-info-table td { padding: 4px 0; font-size: 11px; }
        .card-info-table .label { color: #6b7280; }
        .card-info-table .colon { color: #6b7280; width: 15px; text-align: center; }
        .card-info-table .value { font-weight: bold; color: #1f2937; text-align: right; }

        .divider { border-top: 1px solid #d1d5db; margin: 15px 0; }

        .leaves-container { display: table; width: 100%; margin-bottom: 25px; }
        .leaves-col { display: table-cell; width: 50%; vertical-align: top; }
        
        .tables-container { display: table; width: 100%; margin-bottom: 20px; }
        .table-col { display: table-cell; width: 48%; vertical-align: top; }
        .table-spacer { display: table-cell; width: 4%; }
        
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; font-size: 11px; font-weight: 700; color: #1f2937; text-transform: uppercase; padding: 10px 12px; border-bottom: 1px solid #d1d5db; }
        .data-table th.right { text-align: right; }
        .data-table td { padding: 12px; font-size: 12px; border-bottom: 1px solid #f3f4f6; }
        .data-table td.right { text-align: right; font-weight: bold; }
        .data-table .total-row td { background-color: #f3f4f6; font-weight: 700; border-bottom: none; border-top: 1px solid #e5e7eb; }

        .total-net-payable { display: table; width: 100%; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 20px; overflow: hidden; }
        .tnp-left { display: table-cell; vertical-align: middle; padding: 15px 18px; width: 75%; }
        .tnp-left .title { font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase; }
        .tnp-left .subtitle { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .tnp-right { display: table-cell; vertical-align: middle; background-color: #e8f5e9; padding: 15px 18px; text-align: right; width: 25%; font-size: 16px; font-weight: 700; color: #1f2937; }

        .amount-words { text-align: right; font-size: 11px; color: #6b7280; margin-bottom: 20px; }
        .amount-words strong { color: #1f2937; }

        .footer { text-align: center; font-size: 10px; color: #9ca3af; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <table class="header-table">
                <tr>
                    <td style="text-align: left; vertical-align: bottom;">
                        @if($logoBase64)
                            <div style="margin-bottom: 8px;">
                                <img src="data:image/png;base64,{{ $logoBase64 }}" alt="Logo" style="max-height: 55px;">
                            </div>
                        @endif
                        <div style="font-size: 18px; font-weight: bold; color: #111827; margin-bottom: 4px;">{{ $companyName }}</div>
                        @php 
                            $addrParts = $companyAddress ? explode("\n", $companyAddress) : []; 
                        @endphp
                        @foreach($addrParts as $line)
                            <div style="font-size: 12px; color: #374151; margin-top: 2px;">{{ $line }}</div>
                        @endforeach
                    </td>
                    <td style="text-align: right; vertical-align: bottom; padding-bottom: 4px;">
                        <div style="font-size: 12px; color: #374151;">Payslip For the Month</div>
                        <div style="font-size: 16px; font-weight: bold; color: #111827; margin-top: 4px;">{{ \Carbon\Carbon::parse($payslip->month.'-01')->format('F Y') }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Employee Summary -->
        <div class="summary-container">
            <div class="summary-left">
                <div class="section-title">Employee Summary</div>
                <table class="info-table">
                    <tr>
                        <td class="label">Employee Name</td>
                        <td class="colon">:</td>
                        <td class="value"><span class="highlight-name">{{ $payslip->staff->name }}</span></td>
                    </tr>
                    <tr>
                        <td class="label">Employee ID</td>
                        <td class="colon">:</td>
                        <td class="value">{{ $payslip->staff->emp_code }}</td>
                    </tr>
                    <tr>
                        <td class="label">Pay Period</td>
                        <td class="colon">:</td>
                        <td class="value">{{ \Carbon\Carbon::parse($payslip->month.'-01')->format('F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="label">Pay Date</td>
                        <td class="colon">:</td>
                        <td class="value">{{ $payslip->pay_date ? \Carbon\Carbon::parse($payslip->pay_date)->format('d/m/Y') : '' }}</td>
                    </tr>
                </table>
            </div>
            <div class="summary-right">
                <div class="net-pay-card">
                    <div class="net-pay-card-top">
                        <div class="amount">&#8377;{{ number_format($payslip->net_pay, 2) }}</div>
                        <div class="label">Total Net Pay</div>
                    </div>
                    <div class="net-pay-card-bottom">
                        <table class="card-info-table">
                            <tr>
                                <td class="label">Paid Days</td>
                                <td class="colon">:</td>
                                <td class="value">{{ $payslip->paid_days }}</td>
                            </tr>
                            <tr>
                                <td class="label">LOP Days</td>
                                <td class="colon">:</td>
                                <td class="value">0</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <!-- Leave Details -->
        @php
            $casualBal = $payslip->staff->leaveBalances->where('leave_type', 'casual')->first();
            $medicalBal = $payslip->staff->leaveBalances->where('leave_type', 'medical')->first();
            $casualAvail = $casualBal ? ($casualBal->available ?? ($casualBal->total - $casualBal->used)) : 12;
            $medicalAvail = $medicalBal ? ($medicalBal->available ?? ($medicalBal->total - $medicalBal->used)) : 12;
            $totalBalance = $casualAvail + $medicalAvail;
            $leaveDays = $payslip->casual_leaves_taken + $payslip->medical_leaves_taken + ($payslip->other_leaves_taken ?? 0);
            $paidDays = $payslip->paid_days;
        @endphp
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb; padding: 15px 0; margin-bottom: 20px; width: 100%;">
            <table style="width: 100%; text-align: center; border-collapse: collapse;">
                <tr>
                    <td style="width: 33.33%; border-right: 1px solid #e5e7eb;">
                        <div style="font-size: 11px; color: #6b7280; margin-bottom: 5px;">Leave Days (This Month)</div>
                        <div style="font-size: 20px; font-weight: bold; color: #ef4444;">{{ $leaveDays }}</div>
                    </td>
                    <td style="width: 33.33%; border-right: 1px solid #e5e7eb;">
                        <div style="font-size: 11px; color: #6b7280; margin-bottom: 5px;">Paid Days</div>
                        <div style="font-size: 20px; font-weight: bold; color: #10b981;">{{ $paidDays }}</div>
                    </td>
                    <td style="width: 33.33%;">
                        <div style="font-size: 11px; color: #6b7280; margin-bottom: 5px;">Leave Balance</div>
                        <div style="font-size: 20px; font-weight: bold; color: #6366f1;">{{ $totalBalance }} days</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Earnings & Deductions Tables -->
        <div class="tables-container">
            <div class="table-col" style="border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>EARNINGS</th>
                            <th class="right">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Basic</td>
                            <td class="right">{{ number_format($payslip->basic_pay, 2) }}</td>
                        </tr>
                        @foreach($earnings as $comp)
                        <tr>
                            <td>{{ $comp->component_name }}</td>
                            <td class="right">{{ number_format($comp->amount, 2) }}</td>
                        </tr>
                        @endforeach
                        <tr class="total-row">
                            <td>Gross Earnings</td>
                            <td class="right">{{ number_format($payslip->gross_earnings, 2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-spacer"></div>
            <div class="table-col" style="border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>DEDUCTIONS</th>
                            <th class="right">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($deductions as $comp)
                        <tr>
                            <td>{{ $comp->component_name }}</td>
                            <td class="right">{{ number_format($comp->amount, 2) }}</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="2" style="color: #9ca3af; font-style: italic;">No deductions</td>
                        </tr>
                        @endforelse
                        <tr class="total-row">
                            <td>Total Deductions</td>
                            <td class="right">{{ number_format($payslip->total_deductions, 2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Total Net Payable -->
        <div class="total-net-payable">
            <div class="tnp-left">
                <div class="title">TOTAL NET PAYABLE</div>
                <div class="subtitle">Gross Earnings - Total Deductions</div>
            </div>
            <div class="tnp-right">
                &#8377;{{ number_format($payslip->net_pay, 2) }}
            </div>
        </div>

        @php
            $words = (function($amount) {
                $n = (int)$amount;
                if ($n == 0) return 'Zero';
                $ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
                    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
                $tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

                $toWords = function($x) use ($ones, $tens) {
                    if ($x == 0) return '';
                    if ($x < 20) return $ones[$x];
                    return $tens[(int)($x / 10)] . ($x % 10 ? ' ' . $ones[$x % 10] : '');
                };

                $parts = [];
                $cr = (int)($n / 10000000); $n %= 10000000;
                $lk = (int)($n / 100000); $n %= 100000;
                $th = (int)($n / 1000); $n %= 1000;
                $hn = (int)($n / 100); $n %= 100;

                if ($cr) $parts[] = $toWords($cr) . ' Crore';
                if ($lk) $parts[] = $toWords($lk) . ' Lakh';
                if ($th) $parts[] = $toWords($th) . ' Thousand';
                if ($hn) $parts[] = $toWords($hn) . ' Hundred';
                if ($n) $parts[] = $toWords($n);

                return implode(' ', $parts);
            })((int)$payslip->net_pay);
        @endphp
        <div class="amount-words">
            Amount In Words : <strong>Indian Rupee {{ $words }} Only</strong>
        </div>

        <div class="divider" style="margin-top: 30px;"></div>

        <!-- Footer -->
        <div class="footer">
            -- This is a system-generated document. --
        </div>
    </div>
</body>
</html>
