<?php

namespace Database\Seeders;

use App\Models\PayComponent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Rajashyam',
            'email' => 'rajashyam@zopapro.com',
            'password' => Hash::make('ZOPAPay@123#'),
        ]);

        PayComponent::insert([
            ['name' => 'House Rent Allowance', 'type' => 'earning', 'default_amount' => 5000],
            ['name' => 'Travel Allowance', 'type' => 'earning', 'default_amount' => 2000],
            ['name' => 'Dearness Allowance', 'type' => 'earning', 'default_amount' => 3000],
            ['name' => 'Medical Allowance', 'type' => 'earning', 'default_amount' => 1500],
            ['name' => 'Performance Bonus', 'type' => 'earning', 'default_amount' => null],
            ['name' => 'Professional Tax', 'type' => 'deduction', 'default_amount' => 200],
            ['name' => 'Income Tax', 'type' => 'deduction', 'default_amount' => null],
            ['name' => 'Provident Fund', 'type' => 'deduction', 'default_amount' => 1800],
        ]);
    }
}
