<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductSubCategoryController;
use App\Http\Controllers\ExhibitorController;
use App\Http\Controllers\VisitorRegistrationController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ScheduleMeetingController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\EmailStatusController;
use App\Models\ScheduleMeeting;
use Illuminate\Support\Facades\Mail;

use App\Mail\wellcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Basic diagnostic endpoints
Route::get('/ping', function () {
    return response()->json(['status' => 'API is functional', 'time' => now()->toDateTimeString()]);
});


Route::get('/send-mail', [MailController::class, 'sendMail']);



// Original API routes with prefix
Route::prefix('meetings')->group(function () {
    Route::get('/', [ScheduleMeetingController::class, 'getBusinessMeetings']);
    Route::post('/{id}/approve', [ScheduleMeetingController::class, 'approveMeeting']);
    Route::post('/{id}/reject', [ScheduleMeetingController::class, 'rejectMeeting']);
    Route::post('/check-processed', [ScheduleMeetingController::class, 'checkAllMeetingsProcessed']);
    Route::post('/approve-all', [ScheduleMeetingController::class, 'approveAllMeetings']);
    Route::post('/reject-all', [ScheduleMeetingController::class, 'rejectAllMeetings']);
    Route::get('/{id}', [ScheduleMeetingController::class, 'getMeeting']);
});

// Email status routes
Route::post('/meetings/send-status-email', [EmailStatusController::class, 'sendStatusEmail']);

Route::get('/visitor/test', [VisitorRegistrationController::class, 'test']);

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


// Product categories and subcategories
Route::get('/categories', [ProductCategoryController::class, 'index']);
Route::get('/categories/{id}/subcategories', [ProductSubCategoryController::class, 'index']);

// Routes for exhibitor matching
Route::post('/exhibitors/search', [ExhibitorController::class, 'searchBySubcategories']);
Route::get('/exhibitors/{exhibitor}/products', [ExhibitorController::class, 'getProducts']);

// Visitor Registration Routes
Route::post('/visitor/register', [RegistrationController::class, 'register']);
Route::get('/visitor/test', [VisitorRegistrationController::class, 'test']);
Route::post('/visitor/echo', [VisitorRegistrationController::class, 'echo']);

// Hosted Buyer Registration endpoint
Route::post('/hosted-registration', [App\Http\Controllers\HostedRegistrationController::class, 'register']);

// Schedule Meetings Routes
// Route::get('/schedule-meetings/business', [ScheduleMeetingController::class, 'getBusinessMeetings']);

// Meeting approval routes
Route::get('/business-meetings', [ScheduleMeetingController::class, 'getBusinessMeetings']);
Route::post('/meetings/{id}/approve', [ScheduleMeetingController::class, 'approveMeeting']);
Route::post('/meetings/{id}/reject', [ScheduleMeetingController::class, 'rejectMeeting']);
Route::post('/meetings/check-processed', [ScheduleMeetingController::class, 'checkAllMeetingsProcessed']);
Route::post('/meetings/approve-all', [ScheduleMeetingController::class, 'approveAllMeetings']);
Route::post('/meetings/reject-all', [ScheduleMeetingController::class, 'rejectAllMeetings']);
Route::get('/meetings/{id}', [ScheduleMeetingController::class, 'getMeeting']);


Route::get('/email-status', [EmailStatusController::class, 'getStatus']);
Route::post('/email-status/mark-sent', [EmailStatusController::class, 'markAsSent']);
Route::post('/email-status/reset', [EmailStatusController::class, 'resetAllStatuses']);

