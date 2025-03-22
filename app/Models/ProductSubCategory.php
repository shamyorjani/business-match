<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductSubCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_category_id',
        'name',
        'description',
        'status',
    ];

    /**
     * Get the category that owns the subcategory.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    /**
     * Get the child categories for the subcategory.
     */
    public function childCategories(): HasMany
    {
        return $this->hasMany(ProductChildCategory::class);
    }

    /**
     * Get the visitor interests for this subcategory.
     */
    public function visitorInterests(): HasMany
    {
        return $this->hasMany(VisitorInterest::class);
    }
}

