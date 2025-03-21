<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class VisitorRegistrationController extends Controller
{
    /**
     * Register a new visitor with company info and interests
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Force proper content type header
        header('Content-Type: application/json');

        try {
            // Log the request data for debugging
            Log::info('VisitorRegistrationController::register called');
            Log::info('Request contains registration data: ' . (isset($request->registration) ? 'Yes' : 'No'));

            // Extremely simplified approach - just acknowledge receipt without database operations
            return response()->json([
                'success' => true,
                'message' => 'Registration request received successfully',
                'data_received' => true
            ]);

        } catch (Exception $e) {
            Log::error('Error in simplified registration: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Error processing registration: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Simple test endpoint to verify API functionality
     */
    public function test()
    {
        return response()->json([
            'success' => true,
            'message' => 'Test endpoint is working'
        ]);
    }

    /**
     * Echo back the received data without processing
     */
    public function echo(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Echo endpoint is working',
            'data_received' => $request->all()
        ]);
    }
}
