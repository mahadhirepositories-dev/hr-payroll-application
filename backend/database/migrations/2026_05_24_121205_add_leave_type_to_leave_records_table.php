<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_records', function (Blueprint $table) {
            $table->string('leave_type')->default('casual')->after('staff_id');
        });
    }

    public function down(): void
    {
        Schema::table('leave_records', function (Blueprint $table) {
            $table->dropColumn('leave_type');
        });
    }
};
