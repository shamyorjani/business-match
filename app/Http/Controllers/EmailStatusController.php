<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnum;
use App\Models\EmailStatus;
use App\Models\ScheduleMeeting;
use App\Models\User;
use App\Models\VisitorCompanyInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailStatusController extends Controller
{
    public function sendStatusEmail(Request $request)
    {
        try {
            // Dummy data for testing
            $emailData = [
                'user' => 'Test User',
                'visitorCompany' => 'Test Company',
                'status' => 'Approved',
                'meetingDate' => '2024-03-20',
                'meetingTime' => '10:00 AM',
                'location' => 'Meeting Room A'
            ];

            // Send email using the blade template
            Mail::send('emails.meeting-status', $emailData, function($message) {
                $message->to('programmingwaliid@gmail.com')
                        ->subject('Meeting Schedule Status Update');
            });

            return response()->json([
                'success' => true,
                'message' => 'Status email sent successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error sending status email: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send status email: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sendHostedBuyerEmail(Request $request)
    {
        try {
           
            $emailData = [
                'user' => 'Test User',
                'visitorCompany' => "karachi ki company",
            ];

            // Send email using the blade template
            Mail::send('emails.hosted-varification', $emailData, function($message) {
                $message->to('programmingwaliid@gmail.com')
                        ->subject('Meeting Schedule Status Update');
            });

            return response()->json([
                'success' => true,
                'message' => 'Status email sent successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error sending status email: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send status email: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
}