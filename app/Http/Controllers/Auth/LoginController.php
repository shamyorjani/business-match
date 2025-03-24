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
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('API Token')->plainTextToken;

            // Log the successful login
            Log::info('User logged in successfully', ['user' => $user]);

            return response()->json(['message' => 'Login successful', 'token' => $token]);
        }

        // Log the failed login attempt
        Log::warning('Login failed for user', ['email' => $request->email]);

        return response()->json(['message' => 'Unauthorized'], 401);
    }

    /**
     * Logout the user and invalidate the token.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        // Revoke the user's token
        Auth::user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Logged out successfully']);
    }
}
