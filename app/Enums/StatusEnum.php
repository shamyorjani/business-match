<?php

namespace App\Enums;

enum StatusEnum: int
{
    case INACTIVE = 0;
    case ACTIVE = 1;
    case PENDING = 2;
    case REJECTED = 3;
    case APPROVED = 4;
    case ARCHIVED = 5;
    case DELETED = 6;

    /**
     * Get all status options as an array.
     *
     * @return array
     */
    public static function asArray(): array
    {
        return [
            self::INACTIVE->value => 'Inactive',
            self::ACTIVE->value => 'Active',
            self::PENDING->value => 'Pending',
            self::REJECTED->value => 'Rejected',
            self::APPROVED->value => 'Approved',
            self::ARCHIVED->value => 'Archived',
            self::DELETED->value => 'Deleted',
        ];
    }

    /**
     * Get status label
     */
    public function label(): string
    {
        return match($this) {
            self::INACTIVE => 'Inactive',
            self::ACTIVE => 'Active',
            self::PENDING => 'Pending',
            self::REJECTED => 'Rejected',
            self::APPROVED => 'Approved',
            self::ARCHIVED => 'Archived',
            self::DELETED => 'Deleted',
        };
    }
}
