<?php

namespace App\Http\Controllers;

use App\Models\HotelBooking;
use App\Models\Payment;
use App\Enums\StatusEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function storeBooking(Request $request)
    {
        try {
            Log::info('Starting booking process', ['request_data' => $request->all()]);
    
            $request->validate([
                'name' => 'required|string|max:255',
                'passportNumber' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phoneNumber' => 'required|string|max:255',
                'additionalName' => 'nullable|string|max:255',
                'additionalPassport' => 'nullable|string|max:255',
                'stayingDuration' => 'required|string|max:255',
                'roomType' => 'required|string|max:255',
                'extraNight' => 'nullable|string|max:255',
                'userId' => 'required|integer',
                'companyId' => 'required|integer',
                'totalAmount' => 'required|numeric|min:0'
            ]);
    
            DB::beginTransaction();
    
            // Get the IDs directly from the request
            $userId = (int) $request->userId;
            $companyId = (int) $request->companyId;
    
            Log::info('Received IDs', [
                'userId' => $userId,
                'companyId' => $companyId
            ]);
    
            // Validate IDs are not zero
            if ($userId === 0 || $companyId === 0) {
                throw new \Exception('Invalid user or company ID');
            }
    
            // Prepare data according to table structure
            $bookingData = [
                'user_id' => $userId,
                'visitor_company_id' => $companyId,
                'name' => (string) $request->name,
                'passport_number' => (string) $request->passportNumber,
                'email' => (string) $request->email,
                'phone_number' => (string) $request->phoneNumber,
                'additional_name' => $request->additionalName ? (string) $request->additionalName : null,
                'additional_passport' => $request->additionalPassport ? (string) $request->additionalPassport : null,
                'staying_duration' => (string) $request->stayingDuration,
                'room_type' => (string) $request->roomType,
                'extra_night' => $request->extraNight ? (string) $request->extraNight : null,
                'total_amount' => (float) $request->totalAmount,
                'status' => StatusEnum::PENDING
            ];
    
            Log::info('Attempting to create booking with data', ['booking_data' => $bookingData]);
    
            $booking = HotelBooking::create($bookingData);
    
            Log::info('Booking created successfully', ['booking_id' => $booking->id]);
    
            DB::commit();
    
            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'booking_id' => $booking->id
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating booking', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating booking: ' . $e->getMessage()
            ], 500);
        }
    }
    
    
    
    public function processPayment(Request $request)
    {
        $request->validate([
            'hotel_booking_id' => 'required|exists:hotel_bookings,id',
            'payment_type' => 'required|in:full,deposit',
            'payment_method' => 'required|in:credit,online',
            'amount' => 'required|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            $booking = HotelBooking::findOrFail($request->hotel_booking_id);

            // Check if booking is already confirmed
            if ($booking->status === StatusEnum::APPROVED) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking is already confirmed'
                ], 400);
            }

            // Create payment record
            $payment = Payment::create([
                'hotel_booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'visitor_company_id' => $booking->visitor_company_id,
                'order_id' => 'ORD-' . Str::upper(Str::random(8)),
                'amount' => $request->amount,
                'payment_type' => $request->payment_type,
                'payment_method' => $request->payment_method,
                'status' => StatusEnum::PENDING,
                'payment_details' => [
                    'payment_type' => $request->payment_type,
                    'payment_method' => $request->payment_method,
                    'amount' => $request->amount,
                    'booking_details' => [
                        'staying_duration' => $booking->staying_duration,
                        'room_type' => $booking->room_type,
                        'extra_night' => $booking->extra_night
                    ]
                ]
            ]);

            // Here you would integrate with your payment gateway
            // For now, we'll simulate a successful payment
            $payment->update([
                'status' => StatusEnum::APPROVED,
                'transaction_id' => 'TXN-' . Str::upper(Str::random(8))
            ]);

            // Update booking status
            $booking->update(['status' => StatusEnum::APPROVED]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'transaction_id' => $payment->transaction_id,
                'amount' => $payment->amount,
                'payment_type' => $payment->payment_type
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error processing payment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getBookingDetails($id)
    {
        try {
            $booking = HotelBooking::with(['user', 'visitorCompany', 'payments'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching booking details: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPaymentDetails($id)
    {
        try {
            $payment = Payment::with(['hotelBooking', 'user', 'visitorCompany'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'payment' => $payment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching payment details: ' . $e->getMessage()
            ], 500);
        }
    }

    public function cancelBooking($id)
    {
        try {
            $booking = HotelBooking::findOrFail($id);

            // Check if booking can be cancelled
            if ($booking->status === StatusEnum::REJECTED) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking is already cancelled'
                ], 400);
            }

            // Update booking status
            $booking->update(['status' => StatusEnum::REJECTED]);

            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error cancelling booking: ' . $e->getMessage()
            ], 500);
        }
    }
} 