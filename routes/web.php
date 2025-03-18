<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;

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
});

// Laravel's default authentication routes
Auth::routes();

// SPA catch-all route
Route::get('/{any}', function () {
    return view('layouts.app');
})->where('any', '.*');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
