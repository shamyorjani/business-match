<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'description'
    ];

    public function company()
    {
        return $this->belongsTo(ExhibitorCompanyInfo::class, 'company_id');
    }

    public function subCategories()
    {
        return $this->hasMany(ProductSubCategory::class);
    }
}
