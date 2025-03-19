<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorCompanyInfo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'registration_id',
        'user_id',
        'company_website',
        'company_phone_number',
        'address_line_1',
        'address_line_2',
        'city',
        'region',
        'postal_code',
        'country',
        'company_document',
    ];

    /**
     * Get the registration that owns the company info.
     */
    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }

    /**
     * Get the user that owns the company info.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
