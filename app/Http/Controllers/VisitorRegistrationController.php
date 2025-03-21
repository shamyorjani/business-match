<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\VisitorCompanyInfo;
use App\Models\VisitorInterest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        try {
            // Begin transaction
            DB::beginTransaction();

            // Get registration data from request
            $registrationData = $request->input('registration');
            $companyData = $request->input('companyInfo');
            $interestsData = $request->input('interests');
            $meetingsData = $request->input('meetings');

            // Create registration record
            $registration = Registration::create([
                'user_id' => null, // Visitor isn't a user yet
                'name' => $registrationData['name'],
                'designation' => $registrationData['designation'],
                'email' => $registrationData['email'],
                'phone_number' => $registrationData['phoneNumber'],
                'company_name' => $registrationData['companyName'],
                'company_nature' => $registrationData['companyNature'],
                'company_size' => $registrationData['companySize'],
                'registration_type' => 'business',
            ]);

            // Create visitor company info
            $companyInfo = VisitorCompanyInfo::create([
                'registration_id' => $registration->id,
                'user_id' => null,
                'company_website' => $companyData['website'],
                'company_phone_number' => $companyData['companyPhone'],
                'address_line_1' => $companyData['addressLine1'],
                'address_line_2' => $companyData['addressLine2'],
                'city' => $companyData['city'],
                'region' => $companyData['region'],
                'postal_code' => $companyData['postalCode'],
                'country' => $companyData['country'],
                'company_document' => null,
            ]);

            // Save interests
            if (!empty($interestsData)) {
                foreach ($interestsData as $interest) {
                    // Find the subcategory in the database
                    $subCategory = DB::table('product_sub_categories')
                        ->where('name', $interest['subCategory'])
                        ->first();

                    if ($subCategory) {
                        // Find the parent category
                        $category = DB::table('product_categories')
                            ->where('id', $subCategory->product_category_id)
                            ->first();

                        VisitorInterest::create([
                            'registration_id' => $registration->id,
                            'visitor_company_id' => $companyInfo->id,
                            'product_category_id' => $category ? $category->id : null,
                            'product_sub_category_id' => $subCategory->id,
                            'product_child_category_id' => null,
                            'status' => 1,
                        ]);
                    }
                }
            }

            // Save meetings (additional functionality - could store to a meetings table)
            // This would require creating a meetings table and model

            // Commit transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'registration_id' => $registration->id
            ]);
        } catch (Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            Log::error('Visitor registration failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
