<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;
use App\Models\LeaveRecord;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    private function syncBalance(LeaveRecord $record): void
    {
        $year = $record->from_date->year;
        $days = $record->days;
        $balance = LeaveBalance::firstOrCreate(
            ['staff_id' => $record->staff_id, 'leave_type' => $record->leave_type, 'year' => $year],
            ['total' => 12, 'used' => 0]
        );
        $used = LeaveRecord::where('staff_id', $record->staff_id)
            ->where('leave_type', $record->leave_type)
            ->whereYear('from_date', $year)
            ->where('status', 'approved')
            ->get()->sum(fn($r) => $r->days);
        $balance->update(['used' => $used]);
    }

    public function balances(Request $request): JsonResponse
    {
        $request->validate(['year' => 'required|integer']);
        $staff = Staff::with(['leaveBalances' => fn($q) => $q->where('year', $request->year)])->get();
        return response()->json($staff);
    }

    public function updateBalance(Request $request): JsonResponse
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'leave_type' => 'required|exists:leave_types,name',
            'total' => 'required|numeric|min:0',
            'year' => 'required|integer',
        ]);

        $balance = LeaveBalance::updateOrCreate(
            ['staff_id' => $request->staff_id, 'leave_type' => $request->leave_type, 'year' => $request->year],
            ['total' => $request->total]
        );

        return response()->json($balance);
    }

    public function staffBalances(Staff $staff, int $year): JsonResponse
    {
        return response()->json($staff->leaveBalances()->where('year', $year)->get());
    }

    // Leave Records CRUD
    public function records(Request $request): JsonResponse
    {
        $query = LeaveRecord::with('staff');
        if ($request->month) {
            $year = substr($request->month, 0, 4);
            $month = substr($request->month, 5, 2);
            $start = "$year-$month-01";
            $end = date('Y-m-t', strtotime($start));
            $query->where('from_date', '<=', $end)
                  ->where('to_date', '>=', $start);
        }
        if ($request->staff_id) {
            $query->where('staff_id', $request->staff_id);
        }
        return response()->json($query->orderByDesc('from_date')->get());
    }

    public function storeRecord(Request $request): JsonResponse
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'leave_type' => 'nullable|exists:leave_types,name',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'reason' => 'nullable|string|max:500',
            'status' => 'nullable|in:pending,approved',
        ]);

        $record = LeaveRecord::create([
            'staff_id' => $request->staff_id,
            'leave_type' => $request->leave_type ?? 'casual',
            'from_date' => $request->from_date,
            'to_date' => $request->to_date,
            'reason' => $request->reason,
            'status' => $request->status ?? 'pending',
        ]);

        if ($record->status === 'approved') {
            $this->syncBalance($record);
        }

        return response()->json($record->load('staff'), 201);
    }

    public function updateRecord(Request $request, LeaveRecord $leaveRecord): JsonResponse
    {
        $request->validate([
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'reason' => 'nullable|string|max:500',
            'status' => 'nullable|in:pending,approved',
        ]);

        $leaveRecord->update($request->only(['from_date', 'to_date', 'reason', 'status']));
        $leaveRecord->load('staff');

        if ($leaveRecord->status === 'approved') {
            $this->syncBalance($leaveRecord);
        }

        return response()->json($leaveRecord);
    }

    public function deleteRecord(LeaveRecord $leaveRecord): JsonResponse
    {
        $record = $leaveRecord->replicate();
        $leaveRecord->delete();
        if ($record->status === 'approved') {
            $this->syncBalance($record);
        }
        return response()->json(['message' => 'Deleted']);
    }
}
