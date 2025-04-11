<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class CheckTokenExpiration
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized. Please login.'], 401);
        }

        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'No token provided.'], 401);
        }

        $personalAccessToken = PersonalAccessToken::findToken($token);
        if (!$personalAccessToken) {
            return response()->json(['message' => 'Invalid token.'], 401);
        }

        // Check if token is expired (e.g., after 24 hours)
        if ($personalAccessToken->created_at->addHours(24)->isPast()) {
            $personalAccessToken->delete();
            return response()->json(['message' => 'Token has expired. Please login again.'], 401);
        }

        return $next($request);
    }
} 