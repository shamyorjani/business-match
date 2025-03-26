<?php

namespace App\Http\Controllers;

use App\Models\UnavailableTimeSlot;
use App\Models\ExhibitorCompanyInfo;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UnavailableTimeSlotController extends Controller
{
    /**
     * Get unavailable time slots for a specific exhibitor
     */
    public function getUnavailableSlots(Request $request)
    {
        try {
            // Get the current date
            $currentDate = Carbon::now();
            
            // Get dates for the next 4 days
            $dates = [];
            for ($i = 1; $i <= 4; $i++) {
                $date = $currentDate->copy()->addDays($i);
                $dates[] = [
                    'day' => $i,
                    'date' => $date->format('Y-m-d'),
                    'dayOfWeek' => $date->format('l')
                ];
            }

            // Get all exhibitor companies
            $exhibitors = ExhibitorCompanyInfo::select('id', 'company_name')->get();

            // Get unavailable slots for each exhibitor
            $unavailableSlots = [];
            foreach ($exhibitors as $exhibitor) {
                $slots = UnavailableTimeSlot::where('exhibitor_company_id', $exhibitor->id)
                    ->where('status', 1)
                    ->whereBetween('date', [
                        $currentDate->copy()->addDay()->startOfDay(),
                        $currentDate->copy()->addDays(4)->endOfDay()
                    ])
                    ->get()
                    ->map(function ($slot) use ($dates) {
                        // Find the corresponding day for this date
                        $dateInfo = collect($dates)->firstWhere('date', $slot->date->format('Y-m-d'));
                        
                        return [
                            'day' => $dateInfo['day'],
                            'date' => $slot->date->format('Y-m-d'),
                            'dayOfWeek' => $dateInfo['dayOfWeek'],
                            'time' => $slot->time,
                            'reason' => $slot->reason
                        ];
                    })
                    ->toArray();

                if (!empty($slots)) {
                    $unavailableSlots[$exhibitor->company_name] = $slots;
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'dates' => $dates,
                    'unavailable_slots' => $unavailableSlots
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching unavailable slots',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unavailable time slots for a specific exhibitor
     */
    public function getExhibitorUnavailableSlots($exhibitorId)
    {
        try {
            // Get the current date
            $currentDate = Carbon::now();
            
            // Get dates for the next 4 days
            $dates = [];
            for ($i = 1; $i <= 4; $i++) {
                $date = $currentDate->copy()->addDays($i);
                $dates[] = [
                    'day' => $i,
                    'date' => $date->format('Y-m-d'),
                    'dayOfWeek' => $date->format('l')
                ];
            }

            // Get exhibitor company
            $exhibitor = ExhibitorCompanyInfo::findOrFail($exhibitorId);

            // Get unavailable slots for the exhibitor
            $slots = UnavailableTimeSlot::where('exhibitor_company_id', $exhibitorId)
                ->where('status', 1)
                ->whereBetween('date', [
                    $currentDate->copy()->addDay()->startOfDay(),
                    $currentDate->copy()->addDays(4)->endOfDay()
                ])
                ->get()
                ->map(function ($slot) use ($dates) {
                    // Find the corresponding day for this date
                    $dateInfo = collect($dates)->firstWhere('date', $slot->date->format('Y-m-d'));
                    
                    return [
                        'day' => $dateInfo['day'],
                        'date' => $slot->date->format('Y-m-d'),
                        'dayOfWeek' => $dateInfo['dayOfWeek'],
                        'time' => $slot->time,
                        'reason' => $slot->reason
                    ];
                })
                ->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'exhibitor' => [
                        'id' => $exhibitor->id,
                        'name' => $exhibitor->company_name
                    ],
                    'dates' => $dates,
                    'unavailable_slots' => $slots
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching unavailable slots',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 