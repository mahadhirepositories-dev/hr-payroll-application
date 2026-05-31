<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Model
{
    protected $fillable = [
        'name', 'emp_code', 'basic_pay', 'designation',
        'department', 'joining_date', 'is_active',
        'pan', 'aadhar', 'bank_account_no', 'bank_name', 'ifsc_code',
        'personal_phone', 'office_phone', 'personal_email', 'official_email', 'address',
    ];

    protected function casts(): array
    {
        return [
            'basic_pay' => 'decimal:2',
            'joining_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class);
    }

    public function leaveRecords(): HasMany
    {
        return $this->hasMany(LeaveRecord::class);
    }

    public function payComponents()
    {
        return $this->belongsToMany(PayComponent::class)->withPivot('amount')->withTimestamps();
    }

    public function getLeaveBalance(string $type, int $year): LeaveBalance
    {
        return $this->leaveBalances()
            ->firstOrCreate(
                ['leave_type' => $type, 'year' => $year],
                ['total' => $type === 'casual' ? 12 : 12, 'used' => 0]
            );
    }
}
