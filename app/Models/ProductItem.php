<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_child_category_id',
        'name',
        'description',
        'image',
        'price',
    ];

    /**
     * Get the product child category that owns the product item.
     */
    public function childCategory()
    {
        return $this->belongsTo(ProductChildCategory::class, 'product_child_category_id');
    }

    public function subCategory()
    {
        return $this->childCategory->subCategory();
    }

    public function category()
    {
        return $this->subCategory->category();
    }

    public function company()
    {
        return $this->category->company();
    }
}
