<?php

namespace App\Http\Controllers;

use App\Models\ScheduleMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
            $groupedMeetings = $meetingsData->groupBy(function($meeting) {
                return $meeting->user_id . '-' . $meeting->visitor_company_id;
            })->map(function($group) {
                // Get the first meeting to extract user and company info
                $firstMeeting = $group->first();

                return [
                    'id' => $firstMeeting->id,
                    'name' => $firstMeeting->user->name ?? 'Unknown',
                    'company' => $firstMeeting->user->company_name ?? 'Unknown', // Get from user model
                    'companySize' => $firstMeeting->user->company_size ?? 'Unknown', // Get from user model
                    'documents' => !empty($firstMeeting->visitorCompany->company_document), // Check if document exists
                    'status' => $firstMeeting->status === 1 ? 'Approved' : 'Pending',
                    'phoneNumber' => $firstMeeting->user->phone_number ?? 'Unknown',
                    'registrationNumber' => '', // No direct field available
                    'businessNature' => $firstMeeting->user->company_nature ?? 'Unknown',
                    'country' => $firstMeeting->visitorCompany->country ?? 'Unknown',
                    'schedules' => $group->map(function($meeting) {
                        return [
                            'id' => $meeting->id,
                            'day' => $meeting->day,
                            'date' => $meeting->date,
                            'dayOfWeek' => $meeting->day_of_week,
                            'time' => $meeting->time,
                            'exhibitor' => $meeting->exhibitor,
                            'boothNumber' => $meeting->booth_number,
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
}
