<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'designation',
        'email',
        'phone_number',
        'company_name',
        'company_nature',
        'company_size',
        'registration_type',
    ];

    /**
     * Get the company info associated with the registration.
     */
    public function companyInfo()
    {
        return $this->hasOne(VisitorCompanyInfo::class);
    }

    /**
     * Get the user that owns the registration.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
