<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;

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

    // ...existing code...
}
