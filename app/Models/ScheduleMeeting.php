<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleMeeting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'visitor_company_id',
        'interest_id',
        'booth_number',
        'date',
        'day',
        'day_of_week',
        'exhibitor',
        'time',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'day' => 'integer',
        'status' => 'integer',
    ];

    /**
     * Get the user associated with the schedule meeting.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the visitor company associated with the schedule meeting.
     */
    public function visitorCompany()
    {
        return $this->belongsTo(VisitorCompanyInfo::class, 'visitor_company_id');
    }
}
