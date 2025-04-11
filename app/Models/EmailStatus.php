<?php

namespace App\Models;

use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailStatus extends Model
{
    protected $fillable = [
        'user_id',
        'visitor_company_id',
        'status',
        'email_sent_at'
    ];

    protected $casts = [
        'email_sent_at' => 'datetime',
        'status' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function visitorCompany(): BelongsTo
    {
        return $this->belongsTo(VisitorCompanyInfo::class, 'visitor_company_id');
    }

    public function getStatusNameAttribute(): string
    {
        return StatusEnum::fromValue($this->status)?->getName() ?? 'Unknown';
    }

    public function markAsSent(): bool
    {
        return $this->update([
            'status' => StatusEnum::EMAIL_SENT->getValue(),
            'email_sent_at' => now()
        ]);
    }

    public function isEmailSent(): bool
    {
        return $this->status === StatusEnum::EMAIL_SENT->getValue();
    }

    public function isPending(): bool
    {
        return $this->status === StatusEnum::PENDING->getValue();
    }
}
