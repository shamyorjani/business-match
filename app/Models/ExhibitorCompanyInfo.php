<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExhibitorCompanyInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'booth_number',
        'company_name',
        'description',
        'region_country',
        'logo'
    ];

    public function productCategories()
    {
        return $this->hasMany(ProductCategory::class, 'company_id');
    }
}
