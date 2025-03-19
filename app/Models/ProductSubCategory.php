<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSubCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_category_id',
        'name',
        'description'
    ];

    /**
     * Get the category that owns the sub category.
     */
    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    /**
     * Get the child categories for the sub category.
     */
    public function childCategories()
    {
        return $this->hasMany(ProductChildCategory::class);
    }
}
