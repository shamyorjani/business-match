<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorCompanyInfo extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'visitor_company_infos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
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
     * Get the user associated with the company info.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the visitor interests for this company.
     */
    public function visitorInterests()
    {
        return $this->hasMany(VisitorInterest::class);
    }
}
