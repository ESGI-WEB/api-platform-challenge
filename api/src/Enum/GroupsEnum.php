<?php

declare(strict_types=1);

namespace App\Enum;

enum GroupsEnum: string
{
    case USER_CREATE = 'user:create';
    case USER_WRITE = 'user:write';
    case USER_WRITE_ADMIN = 'user:write:admin';
    case USER_READ = 'user:read';
    case SERVICE_READ = 'service:read';
    case SCHEDULE_WRITE = 'schedule:write';
    case SCHEDULE_READ = 'schedule:read';
    case HOLIDAY_WRITE = 'holiday:write';
    case HOLIDAY_READ = 'holiday:read';
    case AVAILABLE_SLOT_READ = 'available_slot:read';
    case TRANSLATION_READ = 'translation:read';
    case TRANSLATION_WRITE = 'translation:write';
}
