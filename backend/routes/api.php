<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InventoryItemController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Inventory Items
    Route::get('/inventory-items', [InventoryItemController::class, 'index']);
    Route::post('/inventory-items', [InventoryItemController::class, 'store']);
    Route::post('/inventory-items/bulk', [InventoryItemController::class, 'storeBulk']);
    Route::get('/inventory-items/{id}', [InventoryItemController::class, 'show']);
    Route::put('/inventory-items/{id}', [InventoryItemController::class, 'update']);
    Route::delete('/inventory-items/{id}', [InventoryItemController::class, 'destroy']);
    
    // Stock operations
    Route::post('/inventory-items/{id}/add-stock', [InventoryItemController::class, 'addStock']);
    Route::post('/inventory-items/{id}/deduct-stock', [InventoryItemController::class, 'deductStock']);
    Route::post('/inventory-items/bulk-add', [InventoryItemController::class, 'bulkAddStock']);
    Route::post('/inventory-items/bulk-deduct', [InventoryItemController::class, 'bulkDeductStock']);
});
