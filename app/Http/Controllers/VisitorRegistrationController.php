<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\RegistrationController;

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
        // Forward to the main registration controller
        $registrationController = new RegistrationController();
        return $registrationController->register($request);
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
