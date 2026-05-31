<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveBalance extends Model
{
    protected $fillable = ['staff_id', 'leave_type', 'total', 'used', 'year'];

    protected function casts(): array
    {
        return ['total' => 'decimal:1', 'used' => 'decimal:1'];
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function getAvailableAttribute(): float
    {
        return max(0, $this->total - $this->used);
    }
}
