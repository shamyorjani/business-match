<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VisitorCompanyInfo;
use App\Models\VisitorInterest;
use App\Models\ScheduleMeeting;
use App\Models\UnavailableTimeSlot;
use App\Models\ExhibitorCompanyInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class HostedRegistrationController extends Controller
{
    /**
     * Register a new hosted buyer with company info
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Set the content type header
        header('Content-Type: application/json');

        // Begin a database transaction
        DB::beginTransaction();

        try {
            Log::info('Starting hosted buyer registration process');

            // Get form data from request
            $registrationData = json_decode($request->input('registration'), true);
            $companyData = json_decode($request->input('companyInfo'), true);

            // Step 1: Create Registration record first
            $registration = User::create([
                'name' => $registrationData['name'],
                'email' => $registrationData['email'],
                'designation' => $registrationData['designation'] ?? null,
                'phone_number' => $registrationData['phoneNumber'] ?? null,
                'company_name' => $registrationData['companyName'] ?? null,
                'company_nature' => $registrationData['companyNature'] ?? null,
                'company_size' => $registrationData['companySize'] ?? null,
                'registration_type' => 'hosted',
            ]);

            Log::info('Created hosted buyer registration record', ['id' => $registration->id]);

            // Handle document uploads
            $documents = $request->file('documents');
            $documentPaths = [];

            if ($documents) {
                foreach ($documents as $document) {
                    $path = $document->store('hosted-documents', 'public');
                    $documentPaths[] = $path;
                }
            }

            // Convert document paths to JSON
            $documentJson = !empty($documentPaths) ? json_encode($documentPaths) : null;

            // Step 2: Create Company Info record linked to the registration
            $companyInfo = VisitorCompanyInfo::create([
                'user_id' => $registration->id,
                'company_website' => $companyData['website'] ?? '',
                'company_phone_number' => $companyData['companyPhone'] ?? '',
                'address_line_1' => $companyData['addressLine1'] ?? '',
                'address_line_2' => $companyData['addressLine2'] ?? null,
                'city' => $companyData['city'] ?? '',
                'region' => $companyData['region'] ?? '',
                'postal_code' => $companyData['postalCode'] ?? '',
                'country' => $companyData['country'] ?? 'Malaysia',
                'company_document' => $documentJson,
            ]);

            Log::info('Created hosted buyer company info record', ['id' => $companyInfo->id]);

            // Commit the transaction
            DB::commit();

            // Return success response with registration ID
            return response()->json([
                'success' => true,
                'message' => 'Hosted buyer registration completed successfully',
                'registration_id' => $registration->id
            ]);

        } catch (Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            Log::error('Hosted buyer registration error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save or update visitor interests and scheduled meetings
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveInterestsAndMeetings(Request $request)
    {
        // Set the content type header
        header('Content-Type: application/json');

        // Begin a database transaction
        DB::beginTransaction();

        try {
            Log::info('Starting to save/update visitor interests and meetings');

            // Get data from request
            $userId = $request->input('user_id');
            $companyId = $request->input('company_id');
            $interests = $request->input('interests', []);
            $meetings = $request->input('meetings', []);

            // Validate required data
            if (!$userId || !$companyId) {
                throw new Exception('User ID and Company ID are required');
            }

            // Step 1: Delete existing meetings for this user and company
            ScheduleMeeting::where('user_id', $userId)
                ->where('visitor_company_id', $companyId)
                ->delete();

            // Step 2: Get or create visitor interest record
            $interestRecord = null;
            if (!empty($interests)) {
                // Combine all categories from different interests into a single record
                $allCategories = [];
                $allSubCategories = [];
                $allChildCategories = [];

                foreach ($interests as $interest) {
                    if (!empty($interest['categories'])) {
                        $allCategories = array_merge($allCategories, $interest['categories']);
                    }
                    if (!empty($interest['subCategories'])) {
                        $allSubCategories = array_merge($allSubCategories, $interest['subCategories']);
                    }
                    if (!empty($interest['childCategories'])) {
                        $allChildCategories = array_merge($allChildCategories, $interest['childCategories']);
                    }
                }

                // Remove duplicates
                $allCategories = array_unique($allCategories);
                $allSubCategories = array_unique($allSubCategories);
                $allChildCategories = array_unique($allChildCategories);

                // Get existing interest record
                $interestRecord = VisitorInterest::where('user_id', $userId)
                    ->where('visitor_company_id', $companyId)
                    ->first();

                if ($interestRecord) {
                    // Update existing interest record
                    $interestRecord->update([
                        'product_categories' => json_encode($allCategories),
                        'product_sub_categories' => json_encode($allSubCategories),
                        'product_child_categories' => json_encode($allChildCategories),
                        'status' => 1,
                        'updated_at' => now()
                    ]);
                } else {
                    // Create new interest record
                    $interestRecord = VisitorInterest::create([
                        'user_id' => $userId,
                        'visitor_company_id' => $companyId,
                        'product_categories' => json_encode($allCategories),
                        'product_sub_categories' => json_encode($allSubCategories),
                        'product_child_categories' => json_encode($allChildCategories),
                        'status' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }

                Log::info('Saved/Updated visitor interests', ['user_id' => $userId, 'company_id' => $companyId]);

                // Step 3: Save scheduled meetings with the interest_id
                if (!empty($meetings) && $interestRecord) {
                    // Prepare meeting records for insertion
                    $meetingRecords = [];
                    $unavailableSlots = [];
                    
                    foreach ($meetings as $meeting) {
                        // Convert date format from '9 April 2025' to '2025-04-09'
                        $date = \DateTime::createFromFormat('j F Y', $meeting['date']);
                        if (!$date) {
                            Log::error('Invalid date format', ['date' => $meeting['date']]);
                            continue;
                        }
                        $formattedDate = $date->format('Y-m-d');
                        
                        // Extract and format start time (e.g., "12.00pm-1.00pm" -> "12 pm")
                        $timeRange = $meeting['time'];
                        $startTime = explode('-', $timeRange)[0];
                        
                        // Convert time format
                        $startTime = str_replace('.00', '', $startTime); // Remove .00
                        $startTime = str_replace('1200', '12', $startTime); // Fix 1200 to 12
                        $startTime = str_replace('12pm', '12 pm', $startTime); // Add space for 12 pm
                        $startTime = str_replace('12am', '12 am', $startTime); // Add space for 12 am
                        $startTime = preg_replace('/(\d+)([ap]m)/i', '$1 $2', $startTime); // Add space for other times
                        
                        // Get visitor company name
                        $visitorCompany = VisitorCompanyInfo::find($companyId);
                        $visitorCompanyName = $visitorCompany ? $visitorCompany->company_name : 'Unknown Company';
                        
                        // Add meeting to records array
                        $meetingRecords[] = [
                            'user_id' => $userId,
                            'visitor_company_id' => $companyId,
                            'interest_id' => $interestRecord->id,
                            'booth_number' => $meeting['boothNumber'],
                            'date' => $formattedDate,
                            'day' => $meeting['day'],
                            'day_of_week' => $meeting['dayOfWeek'],
                            'exhibitor' => $meeting['exhibitor'],
                            'time' => $meeting['time'],
                            'status' => 2, // 2 for pending confirmation
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                        
                        // Find exhibitor company
                        $exhibitorCompany = ExhibitorCompanyInfo::where('company_name', $meeting['exhibitor'])->first();
                        
                        // If exhibitor company exists, mark time slot as unavailable
                        if ($exhibitorCompany) {
                            $unavailableSlots[] = [
                                'exhibitor_company_id' => $exhibitorCompany->id,
                                'date' => $formattedDate,
                                'time' => $startTime,
                                'reason' => "Meeting with visitor from " . $visitorCompanyName,
                                'status' => 1,
                                'created_at' => now(),
                                'updated_at' => now()
                            ];
                        } else {
                            Log::warning('Exhibitor company not found', [
                                'exhibitor_name' => $meeting['exhibitor'],
                                'date' => $meeting['date'],
                                'time' => $meeting['time']
                            ]);
                        }
                    }
                    
                    // Insert all meeting records
                    ScheduleMeeting::insert($meetingRecords);
                    
                    // Insert all unavailable time slots
                    if (!empty($unavailableSlots)) {
                        UnavailableTimeSlot::insert($unavailableSlots);
                        Log::info('Marked time slots as unavailable', [
                            'slots_count' => count($unavailableSlots)
                        ]);
                    }
                    
                    Log::info('Saved scheduled meetings', [
                        'user_id' => $userId, 
                        'company_id' => $companyId,
                        'meetings_count' => count($meetingRecords)
                    ]);
                }
            }

            // Commit the transaction
            DB::commit();

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Interests and meetings saved successfully',
                'registration_id' => $userId
            ]);

        } catch (Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            Log::error('Error saving interests and meetings: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'Failed to save interests and meetings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get meetings for a specific user and company
     *
     * @param int $userId
     * @param int $companyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMeetings($userId, $companyId)
    {
        try {
            Log::info('Fetching meetings for user and company', ['user_id' => $userId, 'company_id' => $companyId]);

            // Get meetings from database
            $meetings = ScheduleMeeting::where('user_id', $userId)
                ->where('visitor_company_id', $companyId)
                ->orderBy('day')
                ->orderBy('time')
                ->get();

            // Format meetings for frontend
            $formattedMeetings = $meetings->map(function ($meeting) {
                return [
                    'day' => $meeting->day,
                    'date' => $meeting->date,
                    'dayOfWeek' => $meeting->day_of_week,
                    'time' => $meeting->time,
                    'exhibitor' => $meeting->exhibitor,
                    'boothNumber' => $meeting->booth_number
                ];
            });

            return response()->json([
                'success' => true,
                'meetings' => $formattedMeetings
            ]);

        } catch (Exception $e) {
            Log::error('Error fetching meetings: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch meetings: ' . $e->getMessage()
            ], 500);
        }
    }
}
