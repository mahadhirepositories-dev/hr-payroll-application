<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained()->cascadeOnDelete();
            $table->string('month');
            $table->decimal('basic_pay', 12, 2);
            $table->decimal('gross_earnings', 12, 2)->default(0);
            $table->decimal('total_deductions', 12, 2)->default(0);
            $table->decimal('net_pay', 12, 2);
            $table->decimal('casual_leaves_taken', 4, 1)->default(0);
            $table->decimal('medical_leaves_taken', 4, 1)->default(0);
            $table->decimal('paid_days', 4, 1)->default(30);
            $table->foreignId('generated_by')->constrained('users');
            $table->timestamps();
            $table->unique(['staff_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
