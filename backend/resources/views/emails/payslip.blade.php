<!DOCTYPE html>
<html>
<head>
    <title>Your Payslip</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Dear <strong>{{ $payslip->staff->name }}</strong>,</p>
    
    <p>Please find attached your payslip for the month of <strong>{{ \Carbon\Carbon::parse($payslip->month.'-01')->format('F Y') }}</strong>.</p>
    
    <p>If you have any questions or require clarification regarding your payslip, please reach out to the HR department.</p>
    
    <br>
    <p>Best Regards,<br>
    <strong>HR Department</strong><br>
    Mahadhi Technologies Pvt Ltd</p>
</body>
</html>
