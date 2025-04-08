<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ExhibitorCompanyInfo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    /**
     * Insert unavailable time slots for an exhibitor company.
     *
     * @param int $exhibitorCompanyId
     * @param array $timeSlots Array of time slots with date, time, and reason
     * @return bool
     */
    public static function insertUnavailableSlots($exhibitorCompanyId, array $timeSlots)
    {
        try {
            DB::beginTransaction();

            // Validate exhibitor company exists
            $exhibitorCompany = ExhibitorCompanyInfo::find($exhibitorCompanyId);
            if (!$exhibitorCompany) {
                throw new \Exception("Exhibitor company not found");
            }

            // Prepare data for bulk insert
            $data = array_map(function ($slot) use ($exhibitorCompanyId) {
                return [
                    'exhibitor_company_id' => $exhibitorCompanyId,
                    'date' => $slot['date'],
                    'time' => $slot['time'],
                    'reason' => $slot['reason'] ?? 'Meeting scheduled',
                    'status' => 1,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }, $timeSlots);

            // Insert the time slots
            $result = static::insert($data);

            DB::commit();

            Log::info('Unavailable time slots inserted successfully', [
                'exhibitor_company_id' => $exhibitorCompanyId,
                'slots_count' => count($timeSlots)
            ]);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error inserting unavailable time slots: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Mark time slots as available (delete or update status)
     *
     * @param int $exhibitorCompanyId
     * @param array $timeSlots Array of time slots with date and time
     * @return bool
     */
    public static function markSlotsAsAvailable($exhibitorCompanyId, array $timeSlots)
    {
        try {
            DB::beginTransaction();

            foreach ($timeSlots as $slot) {
                static::where('exhibitor_company_id', $exhibitorCompanyId)
                    ->whereDate('date', $slot['date'])
                    ->where('time', $slot['time'])
                    ->delete();
            }

            DB::commit();

            Log::info('Time slots marked as available', [
                'exhibitor_company_id' => $exhibitorCompanyId,
                'slots_count' => count($timeSlots)
            ]);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error marking time slots as available: ' . $e->getMessage());
            return false;
        }
    }
} 