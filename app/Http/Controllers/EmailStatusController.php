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
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'visitor_company_id' => 'required|exists:visitor_company_infos,id',
                'schedules' => 'required|array'
            ]);

            $user = User::findOrFail($request->user_id);
            $visitorCompany = VisitorCompanyInfo::findOrFail($request->visitor_company_id);
            $schedules = $request->schedules;

            // Calculate counts for the email
            $approvedCount = collect($schedules)->where('status', 4)->count();
            $rejectedCount = collect($schedules)->where('status', 3)->count();
            $pendingCount = collect($schedules)->whereNotIn('status', [3, 4])->count();

            // Prepare data for the email template
            $emailData = [
                'user' => $user,
                'visitorCompany' => $visitorCompany,
                'schedules' => $schedules,
                'approvedCount' => $approvedCount,
                'rejectedCount' => $rejectedCount,
                'pendingCount' => $pendingCount,
                'totalMeetings' => count($schedules)
            ];

            // Send email using the blade template
            Mail::send('emails.meeting-status', $emailData, function($message) use ($user) {
                $message->to($user->email)
                        ->subject('Meeting Schedule Status Update');
            });

            // Update email status
            $status = EmailStatus::where('user_id', $request->user_id)
                ->where('visitor_company_id', $request->visitor_company_id)
                ->first();

            if (!$status) {
                $status = EmailStatus::create([
                    'user_id' => $request->user_id,
                    'visitor_company_id' => $request->visitor_company_id,
                    'status' => StatusEnum::EMAIL_SENT->getValue(),
                    'email_sent_at' => now()
                ]);
            } else {
                $status->markAsSent();
            }

            return response()->json([
                'success' => true,
                'message' => 'Status email sent successfully',
                'status' => $status->status,
                'status_name' => $status->status_name,
                'email_sent_at' => $status->email_sent_at
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