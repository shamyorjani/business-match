<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductSubCategoryController;
use App\Http\Controllers\ExhibitorController;

Route::get('/test', function () {
    Log::info('Test endpoint hit');
    return response()->json([
        'status' => 'API is working!',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// API Routes for Authentication
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);
Route::get('/user', function () {
    if (Auth::check()) {
        return response()->json(Auth::user());
    }
    return response()->json(null, 401);
});
Route::get('/categories', [ProductCategoryController::class, 'index']);
Route::get('/categories/{id}/subcategories', [ProductSubCategoryController::class, 'index']);

// Routes for exhibitor matching
Route::post('/exhibitors/search', [ExhibitorController::class, 'searchBySubcategories']);
Route::get('/exhibitors/{exhibitor}/products', [ExhibitorController::class, 'getProducts']);
