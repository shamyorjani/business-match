<?php

namespace App\Models;

use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyProduct extends Model
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
        'image',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => 'integer',
    ];

    /**
     * Get the company that owns the product.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(ExhibitorCompanyInfo::class, 'company_id');
    }

    /**
     * Check if the product is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === StatusEnum::ACTIVE->value;
    }
}
