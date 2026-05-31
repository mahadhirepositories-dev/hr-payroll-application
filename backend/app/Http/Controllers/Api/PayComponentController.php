<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PayComponent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayComponentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(PayComponent::orderBy('type')->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:earning,deduction',
            'default_amount' => 'nullable|numeric|min:0',
        ]);

        return response()->json(PayComponent::create($request->all()), 201);
    }

    public function update(Request $request, PayComponent $payComponent): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:earning,deduction',
            'default_amount' => 'nullable|numeric|min:0',
        ]);

        $payComponent->update($request->all());
        return response()->json($payComponent);
    }

    public function destroy(PayComponent $payComponent): JsonResponse
    {
        $payComponent->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
