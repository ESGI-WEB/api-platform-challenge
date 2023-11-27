<?php

declare(strict_types=1);

namespace App\Enum;

enum AppointmentStatusEnum: string
{
    use EnumHelperTrait;

    case valid = 'valid';
    case cancelled = 'cancelled';
}
