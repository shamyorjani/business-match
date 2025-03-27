<?php

namespace App\Http\Controllers;

use App\Models\VisitorCompanyInfo;
use App\Models\User;
use App\Models\EmailStatus;
use App\Enums\StatusEnum;
use Illuminate\Http\Request;

class HostedBuyerRegistrationController extends Controller
{
    public function getHostedRegistrations()
    {
        try {
            // Get all VisitorCompanyInfo records where user's registration type is hosted
            $hostedBuyers = VisitorCompanyInfo::with(['user' => function($query) {
                $query->where('registration_type', 'hosted');
            }])
            ->whereHas('user', function($query) {
                $query->where('registration_type', 'hosted');
            })
            ->get()
            ->map(function($company) {
                // Parse the JSON string of documents
                $documents = [];
                if ($company->company_document) {
                    $documentPaths = json_decode($company->company_document, true);
                    if (is_array($documentPaths)) {
                        $documents = array_map(function($path, $index) {
                            return [
                                'id' => $index + 1,
                                'url' => asset('storage/' . $path),
                                'type' => 'image'
                            ];
                        }, $documentPaths, array_keys($documentPaths));
                    }
                }

                // Get email status
                $emailStatus = EmailStatus::where('user_id', $company->user_id)
                    ->where('visitor_company_id', $company->id)
                    ->first();

                $status = $emailStatus ? $emailStatus->status_name : 'Pending';
                $statusValue = $emailStatus ? $emailStatus->status : StatusEnum::PENDING->getValue();

                return [
                    'id' => $company->id,
                    'user_id' => $company->user_id,
                    'company_id' => $company->id,
                    'name' => $company->user->name,
                    'company' => $company->user->company_name ?? 'N/A',
                    'companySize' => $company->user->company_size ?? 'N/A',
                    'arrivalDate' => $company->arrival_date ?? 'N/A',
                    'departureDate' => $company->departure_date ?? 'N/A',
                    'status' => $status,
                    'status_value' => $statusValue,
                    'accommodationStatus' => $company->accommodation_status ?? 'Pending',
                    'flightStatus' => $company->flight_status ?? 'Pending',
                    'phoneNumber' => $company->company_phone_number,
                    'email' => $company->user->email,
                    'specialRequirements' => $company->special_requirements ?? 'None',
                    'documents' => $documents
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $hostedBuyers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch hosted buyer registrations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
