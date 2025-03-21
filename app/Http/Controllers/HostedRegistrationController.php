<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VisitorCompanyInfo;
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
}
