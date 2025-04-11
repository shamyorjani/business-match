<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\VisitorCompanyInfo;
use Illuminate\Database\Eloquent\Model;

class HotelBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'visitor_company_id',
        'name',
        'passport_number',
        'email',
        'phone_number',
        'additional_name',
        'additional_passport',
        'staying_duration',
        'room_type',
        'extra_night',
        'total_amount',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function visitorCompany()
    {
        return $this->belongsTo(VisitorCompanyInfo::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
} 