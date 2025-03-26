<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'token.expiration']);
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
} 