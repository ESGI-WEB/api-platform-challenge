<?php

declare(strict_types=1);

namespace App\Enum;

enum GroupsEnum: string
{
    case USER_CREATE = 'user:create';
    case USER_WRITE = 'user:write';
    case USER_WRITE_ADMIN = 'user:write:admin';
    case USER_READ = 'user:read';
}
