<?php

namespace App\Enums;

// Add fallback logic in case PHP version doesn't support enums
if (PHP_VERSION_ID < 80100) {
    class StatusEnum {
        const PENDING = 2;
        const REJECTED = 3;
        const APPROVED = 1;
        const UPDATED_APPROVED = 4;

        public static function getValue($case) {
            return constant("self::$case");
        }
    }
} else {
    enum StatusEnum: int
    {
        case PENDING = 2;
        case REJECTED = 3;
        case APPROVED = 1;
        case UPDATED_APPROVED = 4;

        /**
         * Get the integer value for this enum case
         */
        public function getValue(): int
        {
            return $this->value;
        }

        /**
         * Get the enum case from an integer value
         */
        public static function fromValue(int $value): ?StatusEnum
        {
            foreach (self::cases() as $case) {
                if ($case->value === $value) {
                    return $case;
                }
            }

            return null;
        }

        /**
         * Get the display name for this status
         */
        public function getName(): string
        {
            return match($this) {
                self::PENDING => 'Pending',
                self::REJECTED => 'Rejected',
                self::APPROVED => 'Approved',
                self::UPDATED_APPROVED => 'Approved',
            };
        }
    }
}
