<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

// You can keep your test endpoint
Route::get('/test', function () {
    Log::info('Test endpoint hit');
    return response()->json([
        'status' => 'API is working!',
        'timestamp' => now()->toDateTimeString()
    ]);
});
