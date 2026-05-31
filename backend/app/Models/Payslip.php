<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payslip extends Model
{
    protected $fillable = [
        'staff_id', 'month', 'pay_date', 'basic_pay', 'gross_earnings',
        'total_deductions', 'net_pay', 'casual_leaves_taken',
        'medical_leaves_taken', 'paid_days', 'generated_by',
    ];

    protected function casts(): array
    {
        return [
            'pay_date' => 'date:Y-m-d',
            'basic_pay' => 'decimal:2',
            'gross_earnings' => 'decimal:2',
            'total_deductions' => 'decimal:2',
            'net_pay' => 'decimal:2',
            'casual_leaves_taken' => 'decimal:1',
            'medical_leaves_taken' => 'decimal:1',
            'paid_days' => 'decimal:1',
        ];
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function components(): HasMany
    {
        return $this->hasMany(PayslipComponent::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
