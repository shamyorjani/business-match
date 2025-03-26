<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ExhibitorCompanyInfo;

class UnavailableTimeSlot extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'exhibitor_company_id',
        'date',
        'time',
        'reason',
        'status'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'status' => 'integer'
    ];

    /**
     * Get the exhibitor company that owns the unavailable time slot.
     */
    public function exhibitorCompany()
    {
        return $this->belongsTo(ExhibitorCompanyInfo::class, 'exhibitor_company_id');
    }

    /**
     * Scope a query to only include active slots.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    /**
     * Scope a query to filter by exhibitor company.
     */
    public function scopeForExhibitor($query, $exhibitorCompanyId)
    {
        return $query->where('exhibitor_company_id', $exhibitorCompanyId);
    }

    /**
     * Scope a query to filter by date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    /**
     * Scope a query to filter by time.
     */
    public function scopeForTime($query, $time)
    {
        return $query->where('time', $time);
    }

    /**
     * Check if a slot is unavailable for a given exhibitor, date, and time.
     */
    public static function isUnavailable($exhibitorCompanyId, $date, $time)
    {
        return static::active()
            ->forExhibitor($exhibitorCompanyId)
            ->forDate($date)
            ->forTime($time)
            ->exists();
    }

    /**
     * Get all unavailable slots for an exhibitor company.
     */
    public static function getUnavailableSlotsForExhibitor($exhibitorCompanyId)
    {
        return static::active()
            ->forExhibitor($exhibitorCompanyId)
            ->get()
            ->map(function ($slot) {
                return [
                    'date' => $slot->date,
                    'time' => $slot->time,
                    'reason' => $slot->reason
                ];
            })
            ->toArray();
    }

    /**
     * Get unavailable slots for a specific date range.
     */
    public static function getUnavailableSlotsForDateRange($exhibitorCompanyId, $startDate, $endDate)
    {
        return static::active()
            ->forExhibitor($exhibitorCompanyId)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();
    }
} 