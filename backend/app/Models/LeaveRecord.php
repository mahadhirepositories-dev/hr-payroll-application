<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRecord extends Model
{
    protected $fillable = ['staff_id', 'leave_type', 'from_date', 'to_date', 'reason', 'status'];

    protected $appends = ['days'];

    protected function casts(): array
    {
        return [
            'from_date' => 'date',
            'to_date' => 'date',
        ];
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function getDaysAttribute(): int
    {
        return max(1, $this->from_date->diffInDays($this->to_date) + 1);
    }
}
