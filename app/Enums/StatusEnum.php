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
    public static function getOptions(): array
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
     * Get the label for a status value.
     *
     * @param int $value
     * @return string
     */
    public static function getLabel(int $value): string
    {
        return self::getOptions()[$value] ?? 'Unknown';
    }
}
