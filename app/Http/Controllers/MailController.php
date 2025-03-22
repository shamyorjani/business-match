<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use App\Mail\wellcomeEmail;
use Illuminate\Support\Facades\Log;

use Illuminate\Http\Request;

class MailController extends Controller
{
    public function sendMail()
    {
        try {
            $to = "programmingwaliid@gmail.com"; // Fixed email typo
            $subject = "Test Mail";
            $message = "This is a test mail";

            Mail::to($to)->send(new wellcomeEmail($subject, $message));

            Log::info("Mail sent successfully to: $to");

            return response()->json([
                'success' => true,
                'message' => 'Mail sent successfully'
            ]);
        } catch (\Exception $e) {
            Log::error("Mail sending failed: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Mail sending failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test if mail configuration is working
     */
    public function testMailConfig()
    {
        try {
            $config = config('mail');

            // Remove potential sensitive data
            if (isset($config['password'])) {
                $config['password'] = '****';
            }

            return response()->json([
                'success' => true,
                'config' => $config,
                'message' => 'Mail configuration retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error("Error retrieving mail config: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve mail configuration',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
