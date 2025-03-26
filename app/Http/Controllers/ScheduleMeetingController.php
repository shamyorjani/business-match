<?php

namespace App\Http\Controllers;

use App\Models\ScheduleMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Enums\StatusEnum;
use Illuminate\Support\Facades\Mail;
use App\Mail\wellcomeEmail;

class ScheduleMeetingController extends Controller
{
    /**
     * Get all business schedule meetings with user and company information
     */
    public function getBusinessMeetings()
    {
        try {
            // Check if required models exist
            if (!class_exists(ScheduleMeeting::class)) {
                Log::error('ScheduleMeeting model does not exist');
                return response()->json(['error' => 'Required model not found'], 500);
            }

            // Get meetings where the user has registration_type = 'business'
            $meetings = ScheduleMeeting::query();

            // Debug: Check if meetings can be fetched at all
            $meetingsCount = $meetings->count();
            Log::info("Total meetings found: {$meetingsCount}");

            // Adding with() to get related models
            $meetings = $meetings->with(['user', 'visitorCompany']);

            // Check if the user model has the registration_type field
            // And only filter by registration_type if there are actually meetings
            if ($meetingsCount > 0) {
                $meetings = $meetings->whereHas('user', function ($query) {
                    $query->where('registration_type', 'business');
                });
            }

            $meetingsData = $meetings->get();
            Log::info("Filtered meetings found: {$meetingsData->count()}");

            // If no meetings, return empty array
            if ($meetingsData->isEmpty()) {
                return response()->json([]);
            }

            // Group meetings by visitor company and user
            $groupedMeetings = $meetingsData->groupBy(function ($meeting) {
                return $meeting->user_id . '-' . $meeting->visitor_company_id;
            })->map(function ($group) {
                // Get the first meeting to extract user and company info
                $firstMeeting = $group->first();

                // Check email status
                $emailStatus = \App\Models\EmailStatus::where('user_id', $firstMeeting->user_id)
                    ->where('visitor_company_id', $firstMeeting->visitor_company_id)
                    ->first();

                // Determine the status based on email status and meeting status
                $status = 'Pending';
                if ($emailStatus && $emailStatus->status === StatusEnum::EMAIL_SENT->getValue()) {
                    $status = 'Email Sent';
                } else {
                    // Check if all meetings are approved
                    $allApproved = $group->every(function ($meeting) {
                        return $meeting->status === StatusEnum::UPDATED_APPROVED->getValue();
                    });
                    if ($allApproved) {
                        $status = 'Approved';
                    }
                }

                return [
                    'id' => $firstMeeting->id,
                    'name' => $firstMeeting->user->name ?? 'Unknown',
                    'company' => $firstMeeting->user->company_name ?? 'Unknown',
                    'companySize' => $firstMeeting->user->company_size ?? 'Unknown',
                    'documents' => !empty($firstMeeting->visitorCompany->company_document),
                    'status' => $status,
                    'phoneNumber' => $firstMeeting->user->phone_number ?? 'Unknown',
                    'registrationNumber' => '', // No direct field available
                    'businessNature' => $firstMeeting->user->company_nature ?? 'Unknown',
                    'country' => $firstMeeting->visitorCompany->country ?? 'Unknown',
                    'schedules' => $group->map(function ($meeting) {
                        return [
                            'id' => $meeting->id,
                            'day' => $meeting->day,
                            'date' => $meeting->date,
                            'dayOfWeek' => $meeting->day_of_week,
                            'time' => $meeting->time,
                            'exhibitor' => $meeting->exhibitor,
                            'boothNumber' => $meeting->booth_number,
                            'status' => $meeting->status,
                        ];
                    })->values()->all(),
                ];
            })->values()->all();

            return response()->json($groupedMeetings);
        } catch (\Throwable $e) {
            Log::error('Error in getBusinessMeetings: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to fetch business meetings',
                'message' => $e->getMessage(),
                'debug' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            ], 500);
        }
    }

    /**
     * Approve a single meeting
     */
    public function approveMeeting(Request $request, $id)
    {
        // First log point - should appear even if there's an exception
        file_put_contents(
            storage_path('logs/approval_debug.log'),
            date('Y-m-d H:i:s') . " - Approval attempt for ID: $id\n",
            FILE_APPEND
        );

        try {
            // Basic direct query rather than model to check if the record exists
            $exists = \DB::table('schedule_meetings')->where('id', $id)->exists();

            if (!$exists) {
                return response()->json(['error' => 'Meeting not found'], 404);
            }

            // Update directly with query builder to bypass potential model issues
            $updated = \DB::table('schedule_meetings')
                ->where('id', $id)
                ->update(['status' => 4]);

            // Log the outcome
            file_put_contents(
                storage_path('logs/approval_debug.log'),
                date('Y-m-d H:i:s') . " - Direct update result for ID: $id - " . ($updated ? 'Success' : 'Failed') . "\n",
                FILE_APPEND
            );

            return response()->json([
                'success' => true,
                'message' => 'Meeting approved successfully',
                'updated' => $updated
            ]);
        } catch (\Exception $e) {
            // Log the exception details
            file_put_contents(
                storage_path('logs/approval_debug.log'),
                date('Y-m-d H:i:s') . " - Exception for ID: $id - " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n",
                FILE_APPEND
            );

            return response()->json([
                'error' => 'Failed to approve meeting',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject a single meeting
     */
    public function rejectMeeting(Request $request, $id)
    {
        try {
            $meeting = ScheduleMeeting::findOrFail($id);
            $meeting->status = StatusEnum::REJECTED->value;
            $meeting->save();

            return response()->json(['success' => true, 'message' => 'Meeting rejected successfully']);
        } catch (\Throwable $e) {
            Log::error('Error rejecting meeting: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to reject meeting', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Check if all meetings for a user-company pair are processed
     */
    public function checkAllMeetingsProcessed(Request $request)
    {
        try {
            $userId = $request->input('user_id');
            $visitorCompanyId = $request->input('visitor_company_id');

            $pendingMeetings = ScheduleMeeting::where('user_id', $userId)
                ->where('visitor_company_id', $visitorCompanyId)
                ->where('status', StatusEnum::PENDING->value)
                ->count();

            $allProcessed = $pendingMeetings === 0;

            return response()->json([
                'allProcessed' => $allProcessed,
                'pendingCount' => $pendingMeetings
            ]);
        } catch (\Throwable $e) {
            Log::error('Error checking meetings status: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to check meetings status', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Approve all meetings for a user-company pair
     */
    public function approveAllMeetings(Request $request)
    {
        try {
            $userId = $request->input('user_id');
            $visitorCompanyId = $request->input('visitor_company_id');

            // Get all meetings for this user-company pair regardless of status
            $meetings = ScheduleMeeting::where('user_id', $userId)
                ->where('visitor_company_id', $visitorCompanyId)
                ->get();

            foreach ($meetings as $meeting) {
                $meeting->status = 4; // Status 4 means updated and approved
                $meeting->save();
            }

            Log::info('All meetings approved successfully', [
                'user_id' => $userId,
                'visitor_company_id' => $visitorCompanyId,
                'count' => $meetings->count()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'All meetings approved successfully',
                'count' => $meetings->count()
            ]);
        } catch (\Throwable $e) {
            Log::error('Error approving all meetings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to approve all meetings', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reject all meetings for a user-company pair
     */
    public function rejectAllMeetings(Request $request)
    {
        try {
            $userId = $request->input('user_id');
            $visitorCompanyId = $request->input('visitor_company_id');

            $meetings = ScheduleMeeting::where('user_id', $userId)
                ->where('visitor_company_id', $visitorCompanyId)
                ->where('status', StatusEnum::PENDING->value)
                ->get();

            foreach ($meetings as $meeting) {
                $meeting->status = StatusEnum::REJECTED->value;
                $meeting->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'All meetings rejected successfully',
                'count' => $meetings->count()
            ]);
        } catch (\Throwable $e) {
            Log::error('Error rejecting all meetings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to reject all meetings', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a single meeting by ID
     */
    public function getMeeting($id)
    {
        try {
            $meeting = ScheduleMeeting::findOrFail($id);
            return response()->json($meeting);
        } catch (\Throwable $e) {
            Log::error('Error getting meeting: ' . $e->getMessage());
            return response()->json(['error' => 'Meeting not found', 'message' => $e->getMessage()], 404);
        }
    }

    public function sendStatusEmail(Request $request)
    {
        try {
            $userId = $request->input('user_id');
            $visitorCompanyId = $request->input('visitor_company_id');
            $schedules = $request->input('schedules');
            $user = \App\Models\User::find($userId);

            // Calculate counts for the email
            $approvedCount = collect($schedules)->where('status', 4)->count();
            $rejectedCount = collect($schedules)->where('status', 3)->count();
            $pendingCount = collect($schedules)->whereNotIn('status', [3, 4])->count();

            // Prepare data for the email template
            $emailData = [
                'user' => $user,
                'schedules' => $schedules,
                'approvedCount' => $approvedCount,
                'rejectedCount' => $rejectedCount,
                'pendingCount' => $pendingCount,
                'totalMeetings' => count($schedules)
            ];

            $subject = "Meeting Schedule Status Update";

            // Send email using the blade template
            Mail::send('emails.meeting-status', $emailData, function($message) use ($user, $subject) {
                $message->to($user->email)
                        ->subject($subject);
            });

            return response()->json([
                'success' => true,
                'message' => 'Status email sent successfully',
                'request' => $request->all(),
                'user' => $user,
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
