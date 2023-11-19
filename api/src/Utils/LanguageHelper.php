<?php

declare(strict_types=1);

namespace App\Utils;

class LanguageHelper
{
    public const FR_LANGUAGE = 'fr';
    public const EN_LANGUAGE = 'en';

    public static function validateLanguage(string $language): bool
    {
        return in_array($language, [self::FR_LANGUAGE, self::EN_LANGUAGE]);
    }
}