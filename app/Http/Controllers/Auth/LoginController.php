<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;

class LoginController extends Controller
{
    /**
     * Handle a login request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                // Delete any existing tokens
                $user->tokens()->delete();

                // Create new token
                $token = $user->createToken('API Token')->plainTextToken;

                // Log the successful login
                Log::info('User logged in successfully', ['user' => $user]);

                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]);
            }

            // Log the failed login attempt
            Log::warning('Login failed for user', ['email' => $request->email]);

            return response()->json(['message' => 'Unauthorized'], 401);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout the user and invalidate the token.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        try {
            // Get the current user
            $user = Auth::user();
        
            if (!$user) {
                return response()->json(['message' => 'No authenticated user found'], 401);
            }
            
            // Revoke all of the user's tokens
            $user->tokens()->delete();

            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
