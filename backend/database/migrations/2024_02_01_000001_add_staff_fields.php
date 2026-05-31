<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->string('pan', 20)->nullable()->after('emp_code');
            $table->string('aadhar', 20)->nullable()->after('pan');
            $table->string('bank_account_no', 30)->nullable()->after('aadhar');
            $table->string('bank_name', 100)->nullable()->after('bank_account_no');
            $table->string('ifsc_code', 20)->nullable()->after('bank_name');
            $table->string('personal_phone', 20)->nullable()->after('ifsc_code');
            $table->string('office_phone', 20)->nullable()->after('personal_phone');
            $table->string('personal_email', 100)->nullable()->after('office_phone');
            $table->string('official_email', 100)->nullable()->after('personal_email');
            $table->text('address')->nullable()->after('official_email');
        });
    }

    public function down(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn([
                'pan', 'aadhar', 'bank_account_no', 'bank_name', 'ifsc_code',
                'personal_phone', 'office_phone', 'personal_email', 'official_email', 'address'
            ]);
        });
    }
};
