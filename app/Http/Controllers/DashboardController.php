<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class DashboardController extends Controller
{
    public function __construct()
    {
        // Remove middleware since we're handling auth manually in checkToken
    }

    public function index()
    {
        $user = Auth::user();
        return response()->json([
            'message' => 'Welcome to the dashboard',
            'user' => $user
        ]);
    }

    public function profile()
    {
        Log::info('User authenticated', ['user' => Auth::user()]);
        $user = Auth::user();
        return response()->json([
            'user' => $user
        ]);
    }

    public function settings()
    {
        $user = Auth::user();
        return response()->json([
            'user' => $user
        ]);
    }

    public function checkToken(Request $request)
    {
        try {
            $bearerToken = $request->bearerToken();
            Log::info('Received bearer token', ['token' => $bearerToken ? 'present' : 'null']);
            
            if (!$bearerToken) {
                Log::warning('No bearer token provided');
                return response()->json([
                    'message' => 'No token provided'
                ], 401);
            }
            
            // Try to authenticate with the token
            $user = null;
            
            // First try the standard format (id|token)
            if (strpos($bearerToken, '|') !== false) {
                [$id, $token] = explode('|', $bearerToken, 2);
                
                $accessToken = PersonalAccessToken::find($id);
                if ($accessToken) {
                    // Check hashed token
                    if (hash_equals($accessToken->token, hash('sha256', $token))) {
                        $user = $accessToken->tokenable;
                    }
                }
            } 
            // If that fails, try to check if the entire token is stored (legacy/custom format)
            else {
                // Try direct token (for custom implementations)
                $accessToken = PersonalAccessToken::where('token', hash('sha256', $bearerToken))->first();
                if ($accessToken) {
                    $user = $accessToken->tokenable;
                }
            }
            
            if (!$user) {
                // Log both token parts for debugging (without exposing full token)
                Log::warning('Failed to authenticate token');
                return response()->json([
                    'message' => 'Invalid token'
                ], 401);
            }
            
            Log::info('User authenticated successfully', ['user_id' => $user->id]);
            return response()->json([
                'data' => $user
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error checking token', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error checking token',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 