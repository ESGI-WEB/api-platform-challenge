<?php

declare(strict_types=1);

namespace App\Enum;

enum RolesEnum: string
{
    case ADMIN = 'ROLE_ADMIN';
    case PROVIDER = 'ROLE_PROVIDER';
    case EMPLOYEE = 'ROLE_EMPLOYEE';
    case PROVIDER_TO_VALIDATE = 'ROLE_PROVIDER_TO_VALIDATE';
    case USER = 'ROLE_USER';
}
