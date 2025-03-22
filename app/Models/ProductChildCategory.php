<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductChildCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_sub_category_id',
        'name',
        'description',
        'status',
    ];

    /**
     * Get the subcategory that owns the child category.
     */
    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(ProductSubCategory::class, 'product_sub_category_id');
    }

    /**
     * Get the visitor interests for this child category.
     */
    public function visitorInterests(): HasMany
    {
        return $this->hasMany(VisitorInterest::class);
    }
}
