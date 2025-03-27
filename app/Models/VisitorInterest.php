<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitorInterest extends Model
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
        'product_categories',
        'product_sub_categories',
        'product_child_categories',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'product_categories' => 'array',
        'product_sub_categories' => 'array',
        'product_child_categories' => 'array',
    ];

    /**
     * Get the user associated with the interest.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the registration associated with the interest.
     */

    /**
     * Get the visitor company associated with the interest.
     */
    public function visitorCompany(): BelongsTo
    {
        return $this->belongsTo(VisitorCompanyInfo::class, 'visitor_company_id');
    }
}
