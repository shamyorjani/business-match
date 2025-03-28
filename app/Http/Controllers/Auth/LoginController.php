<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
            // Ensure session is started
            if (!$request->hasSession()) {
                $request->setLaravelSession(app('session.store'));
            }

            $credentials = $request->only('email', 'password');

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate();
                
                $user = Auth::user();
                
                $token = $user->createToken('API Token')->plainTextToken;
                
                // Set session cookie
                $cookie = cookie('token', $token, 60 * 24); // 1 day

                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ])->withCookie($cookie);
            }

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
            // Revoke all tokens if user is authenticated
            if (Auth::check()) {
                Auth::user()->tokens()->delete();
            }

            // Clear the session
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Create cookie to clear the token
            $cookie = cookie()->forget('token');

            return response()->json([
                'message' => 'Logged out successfully',
                'clearStorage' => [
                    'auth_token',
                    'user'
                ]
            ])->withCookie($cookie);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
