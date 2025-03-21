<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'name',
        'description',
        'status',
    ];

    // Define the subCategories relationship
    public function subCategories()
    {
        return $this->hasMany(ProductSubCategory::class);
    }

    // Define the company relationship
    public function company()
    {
        return $this->belongsTo(ExhibitorCompanyInfo::class);
    }

    /**
     * Get the visitor interests for the product category.
     */
    public function visitorInterests(): HasMany
    {
        return $this->hasMany(VisitorInterest::class);
    }
}
