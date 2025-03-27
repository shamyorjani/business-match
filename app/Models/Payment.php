<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\HotelBooking;
use App\Models\VisitorCompanyInfo;
use App\Models\User;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_booking_id',
        'user_id',
        'visitor_company_id',
        'order_id',
        'amount',
        'payment_type',
        'payment_method',
        'status',
        'transaction_id',
        'payment_details'
    ];

    protected $casts = [
        'payment_details' => 'array'
    ];

    public function hotelBooking()
    {
        return $this->belongsTo(HotelBooking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function visitorCompany()
    {
        return $this->belongsTo(VisitorCompanyInfo::class);
    }
} 