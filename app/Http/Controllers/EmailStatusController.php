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

    public function sendHostedBuyerEmail(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required',
                'visitor_company_id' => 'required'
            ]);

            $userId = $request->user_id;
            $companyId = $request->visitor_company_id;
            
            // Get user and company data
            $user = User::find($userId);
            $company = VisitorCompanyInfo::find($companyId);

            if (!$user || !$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'User or company not found'
                ], 404);
            }

            // Create payment link with encrypted parameters
            $paymentLink = url('/hosted/payment') . '?' . http_build_query([
                'user' => $userId,  // Send plain user ID
                'company' => $companyId  // Send plain company ID
            ]);
            

            $emailData = [
                'user' => $user->name,
                'visitorCompany' => $company->company_name ?? 'Your Company',
                'paymentLink' => $paymentLink
            ];

            // Send email using the blade template
            Mail::send('emails.hosted-varification', $emailData, function($message) use ($user) {
                $message->to($user->email)
                        ->subject('Hosted Buyer Verification - Proceed to Payment');
            });

            // Update email status to APPROVED
            $status = EmailStatus::where('user_id', $userId)
                ->where('visitor_company_id', $companyId)
                ->first();

            if (!$status) {
                $status = EmailStatus::create([
                    'user_id' => $userId,
                    'visitor_company_id' => $companyId,
                    'status' => StatusEnum::APPROVED->getValue(),
                    'email_sent_at' => now()
                ]);
            } else {
                $status->update([
                    'status' => StatusEnum::APPROVED->getValue(),
                    'email_sent_at' => now()
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Verification email sent successfully',
                'paymentLink' => $paymentLink,
                'status' => $status->status,
                'status_name' => $status->status_name
            ]);

        } catch (\Exception $e) {
            Log::error('Error sending verification email: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification email: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectHostedBuyer(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required',
                'visitor_company_id' => 'required'
            ]);

            $userId = $request->user_id;
            $companyId = $request->visitor_company_id;
            
            // Get user and company data
            $user = User::find($userId);
            $company = VisitorCompanyInfo::find($companyId);

            if (!$user || !$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'User or company not found'
                ], 404);
            }

            $emailData = [
                'user' => $user->name,
                'visitorCompany' => $company->company_name ?? 'Your Company'
            ];

            // Send rejection email using the blade template
            Mail::send('emails.hosted-rejection', $emailData, function($message) use ($user) {
                $message->to($user->email)
                        ->subject('Hosted Buyer Application Status Update');
            });

            // Update email status to REJECTED
            $status = EmailStatus::where('user_id', $userId)
                ->where('visitor_company_id', $companyId)
                ->first();

            if (!$status) {
                $status = EmailStatus::create([
                    'user_id' => $userId,
                    'visitor_company_id' => $companyId,
                    'status' => StatusEnum::REJECTED->getValue(),
                    'email_sent_at' => now()
                ]);
            } else {
                $status->update([
                    'status' => StatusEnum::REJECTED->getValue(),
                    'email_sent_at' => now()
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Rejection email sent successfully',
                'status' => $status->status,
                'status_name' => $status->status_name
            ]);

        } catch (\Exception $e) {
            Log::error('Error sending rejection email: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send rejection email: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
}