<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductSubCategory;
use Illuminate\Support\Facades\Log;

class ExhibitorCompanyInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'booth_number',
        'company_name',
        'description',
        'region_country',
        'logo',
        'categories',
        'sub_categories',
        'child_categories'
    ];

    protected $casts = [
        'categories' => 'array',
        'sub_categories' => 'array',
        'child_categories' => 'array',
    ];

    public function productCategories()
    {
        return $this->hasMany(ProductCategory::class, 'company_id');
    }

    // Get the product profile by joining the subcategory names
    public function getProductProfileAttribute()
    {
        try {
            if (!$this->sub_categories) {
                return null;
            }

            // Handle both string JSON and already decoded array
            $subCategoryIds = is_string($this->sub_categories)
                ? json_decode($this->sub_categories, true)
                : (is_array($this->sub_categories) ? $this->sub_categories : []);

            if (empty($subCategoryIds) || !is_array($subCategoryIds)) {
                return null;
            }

            $subCategories = ProductSubCategory::whereIn('id', $subCategoryIds)->pluck('name');
            return $subCategories->isEmpty() ? null : $subCategories->implode(', ');
        } catch (\Exception $e) {
            Log::error('Error in getProductProfileAttribute: ' . $e->getMessage());
            return null;
        }
    }

    // Add a debug accessor to help troubleshoot
    public function getSubCategoriesDebugAttribute()
    {
        try {
            $raw = $this->attributes['sub_categories'] ?? null;
            $cast = $this->sub_categories;

            return [
                'raw_type' => gettype($raw),
                'raw_value' => $raw,
                'cast_type' => gettype($cast),
                'cast_value' => $cast,
            ];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
