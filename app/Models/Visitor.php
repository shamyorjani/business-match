<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Visitor extends Model
{
    use HasFactory;

    /**
     * Get the interests for the visitor.
     */
    public function interests(): HasMany
    {
        return $this->hasMany(VisitorInterest::class);
    }
}
