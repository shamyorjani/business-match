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

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function childCategories()
    {
        return $this->hasMany(ProductChildCategory::class, 'product_sub_category_id');
    }
}
