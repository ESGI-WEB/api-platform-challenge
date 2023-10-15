<?php

declare(strict_types=1);

namespace App\Enum;

trait EnumHelperTrait
{
    public static function values(): array
    {
        $reflection = new \ReflectionClass(static::class);

        return array_values($reflection->getConstants());
    }
}
