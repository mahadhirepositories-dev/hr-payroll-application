<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveType;
use Illuminate\Http\JsonResponse;

class LeaveTypeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(LeaveType::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|unique:leave_types,name',
            'default_days' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ]);

        return response()->json(LeaveType::create($request->all()), 201);
    }

    public function update(Request $request, LeaveType $leaveType): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|unique:leave_types,name,' . $leaveType->id,
            'default_days' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ]);

        $leaveType->update($request->all());
        return response()->json($leaveType);
    }

    public function destroy(LeaveType $leaveType): JsonResponse
    {
        $leaveType->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
