<?php

declare(strict_types=1);

namespace App\Enum;

enum GroupsEnum: string
{
    case USER_CREATE = 'user:create';
    case USER_WRITE = 'user:write';
    case USER_WRITE_ADMIN = 'user:write:admin';
    case USER_READ = 'user:read';
    case USER_READ_DETAILED = 'user:read:detailed';
    case ORGANISATION_READ = 'organisation:read';
    case ORGANISATION_READ_DETAILED = 'organisation:read:detailed';
    case ORGANISATION_READ_DETAILED_LOGGED = 'organisation:read:detailed:logged';
    case ORGANISATION_UPDATE = 'organisation:update';
    case ORGANISATION_READ_SCHEDULES = 'organisation:read:schedules';
    case ORGANISATION_READ_HOLIDAYS = 'organisation:read:holidays';
    case SERVICE_READ = 'service:read';
    case SERVICE_WRITE = 'service:write';
    case SCHEDULE_WRITE = 'schedule:write';
    case SCHEDULE_READ = 'schedule:read';
    case SCHEDULE_READ_DETAILED = 'schedule:read:detailed';
    case HOLIDAY_WRITE = 'holiday:write';
    case HOLIDAY_READ = 'holiday:read';
    case HOLIDAY_READ_DETAILED = 'holiday:read:detailed';
    case AVAILABLE_SLOT_READ = 'available_slot:read';
    case TRANSLATION_READ = 'translation:read';
    case TRANSLATION_WRITE = 'translation:write';
    case APPOINTMENT_READ = 'appointment:read';
    case APPOINTMENT_READ_DETAILED = 'appointment:read:detailed';
    case APPOINTMENT_WRITE = 'appointment:write';
}
