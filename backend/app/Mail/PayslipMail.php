<?php

namespace App\Mail;

use App\Models\Payslip;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PayslipMail extends Mailable
{
    use Queueable, SerializesModels;

    public $payslip;
    protected $pdfContent;
    protected $pdfName;

    public function __construct(Payslip $payslip, $pdfContent, $pdfName)
    {
        $this->payslip = $payslip;
        $this->pdfContent = $pdfContent;
        $this->pdfName = $pdfName;
    }

    public function build()
    {
        $monthName = \Carbon\Carbon::parse($this->payslip->month.'-01')->format('F Y');
        
        return $this->subject("Payslip for {$monthName} - {$this->payslip->staff->name}")
                    ->view('emails.payslip')
                    ->cc(['dineshkumar@mahadhi.com', 'ganeshkumar@mahadhi.com'])
                    ->attachData($this->pdfContent, $this->pdfName, [
                        'mime' => 'application/pdf',
                    ]);
    }
}
