<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ExhibitorController;
use App\Http\Controllers\ProductCategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test API endpoint check if API is working
Route::get('/test', function () {
    return response()->json([
        'status' => 'API is working!', 
        'timestamp' => now()->toDateTimeString()
    ]);
})->middleware('api');

// Make sure all API routes are using the api middleware
Route::middleware('api')->group(function () {
    // Product Categories
    Route::get('/categories', [ProductCategoryController::class, 'index']);
    Route::get('/categories/create-samples', [ProductCategoryController::class, 'createSamples']);
    
    // Debug routes
    Route::get('/debug', [ExhibitorController::class, 'debug']);
    
    // Exhibitor matching routes
    Route::get('/matching-exhibitors', [ExhibitorController::class, 'getMatchingExhibitors']);
    Route::get('/exhibitors', [ExhibitorController::class, 'getAllExhibitors']);
});

// Catch all undefined API routes
Route::fallback(function(){
    return response()->json([
        'message' => 'API endpoint not found. If you are seeing this message, please check your route or method.',
        'available_endpoints' => [
            '/api/test',
            '/api/categories',
            '/api/matching-exhibitors',
            '/api/exhibitors'
        ]
    ], 404);
})->middleware('api');
