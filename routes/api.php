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
use App\Http\Controllers\HostedBuyerRegistrationController;
use App\Models\ScheduleMeeting;
use Illuminate\Support\Facades\Mail;

use App\Mail\wellcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\UnavailableTimeSlotController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\HostedRegistrationController;

// Move this route to the top of your routes file
// Route::middleware(['web', 'session'])->group(function () {
    Route::post('/user', function (Request $request) {
        $user = $request->input('user');
        $isAuthenticated = $user !== null;
    
        // Perform any necessary actions with the user data
    
        return response()->json([
            'isAuthenticated' => $isAuthenticated,
            'user' => $user,
        ]);
    });
// });

// Test route without middleware first
Route::get('/auth-test', function () {
    return response()->json([
        'session_id' => session()->getId(),
        'has_session' => session()->isStarted(),
        'user' => auth()->user(),
    ]);
});

// Then test with middleware
Route::middleware(['web'])->group(function () {
    Route::get('/user', function () {
        return response()->json([
            'isAuthenticated' => Auth::check(),
            'user' => Auth::user(),
            'session_id' => session()->getId(),
        ]);
    });
});

// Basic diagnostic endpoints
Route::get('/ping', function () {
    return response()->json(['status' => 'API is functional', 'time' => now()->toDateTimeString()]);
});

Route::get('/send-mail', [MailController::class, 'sendMail']);

// Meeting routes with prefix
Route::prefix('meetings')->group(function () {
    Route::get('/', [ScheduleMeetingController::class, 'getBusinessMeetings']);
    Route::post('/{id}/approve', [ScheduleMeetingController::class, 'approveMeeting']);
    Route::post('/{id}/reject', [ScheduleMeetingController::class, 'rejectMeeting']);
    Route::post('/check-processed', [ScheduleMeetingController::class, 'checkAllMeetingsProcessed']);
    Route::post('/approve-all', [ScheduleMeetingController::class, 'approveAllMeetings']);
    Route::post('/reject-all', [ScheduleMeetingController::class, 'rejectAllMeetings']);
    Route::get('/{id}', [ScheduleMeetingController::class, 'getMeeting']);
    Route::put('/{id}', [ScheduleMeetingController::class, 'updateMeeting']);
});

Route::prefix('hosted')->group(function () {
    Route::get('/', [HostedBuyerRegistrationController::class, 'getHostedRegistrations']);
    Route::post('/meetings/save', [HostedRegistrationController::class, 'saveInterestsAndMeetings']);
    Route::get('/meetings/{userId}/{companyId}', [HostedRegistrationController::class, 'getMeetings']);
});

// Email status routes
Route::post('/meetings/send-status-email', [EmailStatusController::class, 'sendStatusEmail']);
Route::post('/hosted/varification-email', [EmailStatusController::class, 'sendHostedBuyerEmail']);
Route::post('/hosted/reject', [EmailStatusController::class, 'rejectHostedBuyer']);

// API Routes for Authentication
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::get('/logout', function (){
    return response()->json([
        'message' => 'Successfully logged out'
    ]);
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

// Unavailable Time Slots routes
Route::prefix('unavailable-slots')->group(function () {
    Route::get('/', [UnavailableTimeSlotController::class, 'getUnavailableSlots']);
    Route::get('/exhibitor/{exhibitorId}', [UnavailableTimeSlotController::class, 'getExhibitorUnavailableSlots']);
});

// Payment Routes
Route::prefix('payments')->group(function () {
    Route::post('/booking/{id}/{companyId}', [PaymentController::class, 'storeBooking']);
    Route::post('/process', [PaymentController::class, 'processPayment']);
    Route::get('/booking/{id}', [PaymentController::class, 'getBookingDetails']);
    Route::get('/{id}', [PaymentController::class, 'getPaymentDetails']);
    Route::post('/booking/{id}/cancel', [PaymentController::class, 'cancelBooking']);
});

