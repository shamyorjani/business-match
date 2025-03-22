<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
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
     * Get the visitor company info associated with the registration.
     */
    public function visitorCompanyInfo()
    {
        return $this->hasOne(VisitorCompanyInfo::class);
    }

    /**
     * Get the user that owns the registration.
     */
    /**
     * Get the visitor interests associated with the registration.
     */
    public function visitorInterests()
    {
        return $this->hasMany(VisitorInterest::class);
    }
}
