<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Staff;
use App\Models\LeaveRecord;

// Clear table
LeaveRecord::truncate();
Staff::truncate();

$staff1 = Staff::create(['name' => 'Dhanancheyan M', 'email' => 'dhan@hr.com', 'designation' => 'Dev', 'department' => 'IT', 'joining_date' => '2023-01-01', 'basic_salary' => 1000]);
$staff2 = Staff::create(['name' => 'Anbuselvan R', 'email' => 'anbu@hr.com', 'designation' => 'Dev', 'department' => 'IT', 'joining_date' => '2023-01-01', 'basic_salary' => 1000]);

// Insert the records from the screenshot
LeaveRecord::create(['staff_id' => $staff1->id, 'from_date' => '2026-05-22', 'to_date' => '2026-05-23', 'status' => 'approved', 'leave_type' => 'casual']);
LeaveRecord::create(['staff_id' => $staff1->id, 'from_date' => '2026-05-11', 'to_date' => '2026-05-12', 'status' => 'approved', 'leave_type' => 'casual']);
LeaveRecord::create(['staff_id' => $staff2->id, 'from_date' => '2026-05-08', 'to_date' => '2026-05-08', 'status' => 'approved', 'leave_type' => 'casual']);
LeaveRecord::create(['staff_id' => $staff1->id, 'from_date' => '2026-05-04', 'to_date' => '2026-05-04', 'status' => 'approved', 'leave_type' => 'casual']);
// The overlapping record
LeaveRecord::create(['staff_id' => $staff2->id, 'from_date' => '2026-04-30', 'to_date' => '2026-05-02', 'status' => 'approved', 'leave_type' => 'casual']);

$request = Illuminate\Http\Request::create('/api/dashboard', 'GET', ['month' => '2026-05']);
$controller = new App\Http\Controllers\Api\SettingController();
$response = $controller->dashboard($request);

echo "DASHBOARD API RESPONSE FOR MAY 2026:\n";
echo json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT);
