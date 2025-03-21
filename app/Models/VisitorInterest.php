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
     * @var array<int, string>
     */
    protected $fillable = [
        'registration_id',
        'visitor_company_id',
        'product_category_id',
        'product_sub_category_id',
        'product_child_category_id',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'product_category_id' => 'integer',
        'product_sub_category_id' => 'integer',
        'product_child_category_id' => 'integer',
    ];

    /**
     * Get the registration associated with the interest.
     */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    /**
     * Get the visitor company associated with the interest.
     */
    public function visitorCompany(): BelongsTo
    {
        return $this->belongsTo(VisitorCompanyInfo::class, 'visitor_company_id');
    }

    /**
     * Get the product category associated with the interest.
     */
    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    /**
     * Get the product subcategory associated with the interest.
     */
    public function productSubCategory(): BelongsTo
    {
        return $this->belongsTo(ProductSubCategory::class);
    }

    /**
     * Get the product child category associated with the interest.
     */
    public function productChildCategory(): BelongsTo
    {
        return $this->belongsTo(ProductChildCategory::class);
    }
}
