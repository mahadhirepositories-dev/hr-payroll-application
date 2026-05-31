<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Staff::with(['leaveBalances', 'payComponents'])->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'emp_code' => 'required|string|unique:staff,emp_code',
            'basic_pay' => 'required|numeric|min:0',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'pan' => 'nullable|string|max:20',
            'aadhar' => 'nullable|string|max:20',
            'bank_account_no' => 'nullable|string|max:30',
            'bank_name' => 'nullable|string|max:100',
            'ifsc_code' => 'nullable|string|max:20',
            'personal_phone' => 'nullable|string|max:20',
            'office_phone' => 'nullable|string|max:20',
            'personal_email' => 'nullable|email|max:100',
            'official_email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
        ]);

        $staff = Staff::create($request->all());

        if ($request->has('pay_components') && is_array($request->pay_components)) {
            $syncData = [];
            foreach ($request->pay_components as $pc) {
                if (!empty($pc['pay_component_id'])) {
                    $syncData[$pc['pay_component_id']] = ['amount' => $pc['amount'] ?? 0];
                }
            }
            $staff->payComponents()->sync($syncData);
        }

        if ($request->has('leave_balances') && is_array($request->leave_balances)) {
            $year = now()->year;
            foreach ($request->leave_balances as $lb) {
                if (!empty($lb['leave_type'])) {
                    $staff->leaveBalances()->updateOrCreate(
                        ['leave_type' => $lb['leave_type'], 'year' => $year],
                        ['total' => $lb['total'] ?? 0]
                    );
                }
            }
        }

        return response()->json($staff->load(['leaveBalances', 'payComponents']), 201);
    }

    public function show(Staff $staff): JsonResponse
    {
        return response()->json($staff->load(['leaveBalances', 'payComponents']));
    }

    public function update(Request $request, Staff $staff): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'emp_code' => 'required|string|unique:staff,emp_code,' . $staff->id,
            'basic_pay' => 'required|numeric|min:0',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'is_active' => 'boolean',
            'pan' => 'nullable|string|max:20',
            'aadhar' => 'nullable|string|max:20',
            'bank_account_no' => 'nullable|string|max:30',
            'bank_name' => 'nullable|string|max:100',
            'ifsc_code' => 'nullable|string|max:20',
            'personal_phone' => 'nullable|string|max:20',
            'office_phone' => 'nullable|string|max:20',
            'personal_email' => 'nullable|email|max:100',
            'official_email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
        ]);

        $staff->update($request->all());

        if ($request->has('pay_components') && is_array($request->pay_components)) {
            $syncData = [];
            foreach ($request->pay_components as $pc) {
                if (!empty($pc['pay_component_id'])) {
                    $syncData[$pc['pay_component_id']] = ['amount' => $pc['amount'] ?? 0];
                }
            }
            $staff->payComponents()->sync($syncData);
        }

        if ($request->has('leave_balances') && is_array($request->leave_balances)) {
            $year = now()->year;
            foreach ($request->leave_balances as $lb) {
                if (!empty($lb['leave_type'])) {
                    $staff->leaveBalances()->updateOrCreate(
                        ['leave_type' => $lb['leave_type'], 'year' => $year],
                        ['total' => $lb['total'] ?? 0]
                    );
                }
            }
        }

        return response()->json($staff->load(['leaveBalances', 'payComponents']));
    }

    public function destroy(Staff $staff): JsonResponse
    {
        $staff->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
