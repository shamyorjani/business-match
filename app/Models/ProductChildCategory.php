<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductChildCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_sub_category_id',
        'name',
        'description',
    ];

    /**
     * Get the product sub-category that owns the child category.
     */
    public function subCategory()
    {
        return $this->belongsTo(ProductSubCategory::class, 'product_sub_category_id');
    }

    /**
     * Get the product items for the product child category.
     */
    public function productItems()
    {
        return $this->hasMany(ProductItem::class, 'product_child_category_id');
    }
}
