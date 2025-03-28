<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductSubCategoryController;
use App\Http\Controllers\MailController;
use Illuminate\Support\Facades\Log;

// Laravel's default authentication routes
Auth::routes();

// Test mail sending
Route::get('/send-mail', [MailController::class, 'sendMail']);


// SPA catch-all route
Route::get('/{any}', function () {
    return View('layouts.app');
})->where('any', '.*');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/log-test', function () {
    Log::info('This is a test log entry.');
    return 'Log entry created';
});

// Add this route to view registrations (for admin access)
Route::get('/admin/registrations', function () {
    $registrations = \App\Models\User::where('registration_type', 'business')
        ->with(['visitorCompanyInfo', 'visitorInterests'])
        ->latest()
        ->paginate(20);

    return view('admin.registrations', compact('registrations'));
})->middleware(['auth', 'admin']);

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
})->where('any', '^(?!api).*$');

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});
