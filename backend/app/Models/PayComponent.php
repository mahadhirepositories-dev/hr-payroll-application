<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayComponent extends Model
{
    protected $fillable = ['name', 'type', 'default_amount', 'is_active'];

    protected function casts(): array
    {
        return [
            'default_amount' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
