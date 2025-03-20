<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductSubCategoryController;
use Illuminate\Support\Facades\Log;

// API Routes for Authentication
Route::prefix('api')->group(function () {
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
});

// Laravel's default authentication routes
Auth::routes();

// SPA catch-all route
Route::get('/{any}', function () {
    return view('layouts.app');
})->where('any', '.*');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/log-test', function () {
    Log::info('This is a test log entry.');
    return 'Log entry created';
});

// Catch all undefined API routes
Route::fallback(function(){
    Log::warning('Fallback route hit');
    return response()->json([
        'message' => 'API endpoint not found. If you are seeing this message, please check your route or method.',
        'available_endpoints' => [
            '/api/test',
            '/api/categories',
            '/api/categories/{id}/subcategories'
        ]
    ], 404);
});
