<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VisitorCompanyInfo;
use App\Models\VisitorInterest;
use App\Models\ScheduleMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class RegistrationController extends Controller
{
    /**
     * Register a new visitor with company info and interests
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
            Log::info('Starting business registration process');

            // Get all form data from request
            $registrationData = $request->input('registration');
            $companyData = $request->input('companyInfo');
            $interestsData = $request->input('interests', []);
            $meetingsData = $request->input('meetings', []);

            // Step 1: Create Registration record first
            $registration = User::create([
                'name' => $registrationData['name'],
                'email' => $registrationData['email'],
                'designation' => $registrationData['designation'] ?? null,
                'phone_number' => $registrationData['phoneNumber'] ?? null,
                'company_name' => $registrationData['companyName'] ?? null,
                'company_nature' => $registrationData['companyNature'] ?? null,
                'company_size' => $registrationData['companySize'] ?? null,
                'registration_type' => 'business',
            ]);

            Log::info('Created registration record', ['id' => $registration->id]);

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
                'company_document' => null,
            ]);

            Log::info('Created company info record', ['id' => $companyInfo->id]);

            // Step 3: Save interests if provided
            if (!empty($interestsData)) {
                // Extract both category and subcategory IDs
                $categoryIds = array_map(function($interest) {
                    return $interest['categoryId'] ?? null;
                }, $interestsData);

                // Filter out any null values
                $categoryIds = array_filter($categoryIds);

                // Extract subcategory IDs
                $subCategoryIds = array_map(function($interest) {
                    return $interest['subCategoryId'] ?? null;
                }, $interestsData);

                // Filter out any null values
                $subCategoryIds = array_filter($subCategoryIds);

                $visitorInterest = VisitorInterest::create([
                    'user_id' => $registration->id,
                    'visitor_company_id' => $companyInfo->id,
                    'product_categories' => $categoryIds, // Store category IDs
                    'product_sub_categories' => $subCategoryIds, // Store subcategory IDs
                    'product_child_categories' => [], // Empty for now as requested
                    'status' => 1,
                ]);

                Log::info('Created interest record', [
                    'id' => $visitorInterest->id,
                    'categories' => $categoryIds,
                    'subcategories' => $subCategoryIds
                ]);
            }

            // Step 4: Save meeting data if provided
            if (!empty($meetingsData)) {
                foreach ($meetingsData as $meeting) {
                    ScheduleMeeting::create([
                        'user_id' => $registration->id,
                        'visitor_company_id' => $companyInfo->id,
                        'interest_id' => $visitorInterest->id ?? null,
                        'booth_number' => $meeting['boothNumber'] ?? null,
                        'date' => $meeting['date'] ?? null,
                        'day' => $meeting['day'] ?? null,
                        'day_of_week' => $meeting['dayOfWeek'] ?? null,
                        'exhibitor' => $meeting['exhibitor'] ?? null,
                        'time' => $meeting['time'] ?? null,
                        'status' => 2, // Default active status
                    ]);
                }

                Log::info('Created meeting records', ['count' => count($meetingsData)]);
            }

            // Commit the transaction
            DB::commit();

            // Return success response with registration ID
            return response()->json([
                'success' => true,
                'message' => 'Registration completed successfully',
                'registration_id' => $registration->id
            ]);

        } catch (Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            Log::error('Registration error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
