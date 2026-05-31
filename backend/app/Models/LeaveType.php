<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = ['name', 'default_days', 'is_active'];

    protected function casts(): array
    {
        return [
            'default_days' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
