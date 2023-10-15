<?php

declare(strict_types=1);

namespace App\Enum;

enum FeedbackTypeEnum: string
{
    use EnumHelperTrait;

    case MARK = 'mark';
    case TEXT = 'text';
    case CHOICE = 'choice';
}
