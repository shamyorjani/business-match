<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductSubCategoryController;
use App\Http\Controllers\ExhibitorController;
use App\Http\Controllers\VisitorRegistrationController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ScheduleMeetingController;
use App\Models\ScheduleMeeting;

// Basic diagnostic endpoints
Route::get('/ping', function () {
    return response()->json(['status' => 'API is functional', 'time' => now()->toDateTimeString()]);
});

Route::get('/direct-meeting-check/{id}', function ($id) {
    try {
        // Direct database query to bypass model issues
        $meeting = DB::table('schedule_meetings')->where('id', $id)->first();

        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found', 'id' => $id], 404);
        }

        return response()->json([
            'success' => true,
            'meeting' => $meeting
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Database error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Direct update endpoint - bypassing controller for testing
Route::post('/direct-meeting-approve/{id}', function ($id) {
    try {
        // Check if meeting exists
        $meeting = DB::table('schedule_meetings')->where('id', $id)->first();

        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found', 'id' => $id], 404);
        }

        // Direct update without models
        $result = DB::table('schedule_meetings')
            ->where('id', $id)
            ->update(['status' => 4]);

        return response()->json([
            'success' => true,
            'updated' => $result,
            'message' => 'Meeting updated successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Database error',
            'message' => $e->getMessage()
        ], 500);
    }
});

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

// Test endpoints for troubleshooting
Route::get('/test', function () {
    Log::info('Test endpoint hit');
    return response()->json([
        'status' => 'API is working!',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Add a simple test endpoint for meeting status updates
Route::get('/test-meeting-update/{id}', function ($id) {
    try {
        $meeting = App\Models\ScheduleMeeting::find($id);
        if (!$meeting) {
            return response()->json([
                'error' => 'Meeting not found',
                'id' => $id
            ], 404);
        }

        return response()->json([
            'message' => 'Meeting found',
            'id' => $meeting->id,
            'status' => $meeting->status,
            'model' => $meeting
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error finding meeting',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

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
