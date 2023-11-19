<?php

declare(strict_types=1);

namespace App\Utils;

use App\ValueObject\Translation;

class TranslationsCsvFileHelper
{
    public const WRITE_CSV_FILE = 'w';
    public const READ_CSV_FILE = 'r';
    public const EN_TRANSLATION_CSV_PATH = '/src/Translations/translations_en.csv';
    public const FR_TRANSLATION_CSV_PATH = '/src/Translations/translations_fr.csv';

    public static function readCsvFile(string $filePath): array
    {
        if (!file_exists($filePath)) {
            return [];
        }

        $file = fopen($filePath, self::READ_CSV_FILE);
        $data = [];
        while (($row = fgetcsv($file)) !== false) {
            $data[] = new Translation($row[0], $row[1], $row[2]);
        }
        fclose($file);

        return $data;
    }

    public static function writeCsvFile(string $filePath, array $data): void
    {
        $file = fopen($filePath, self::WRITE_CSV_FILE);
        foreach ($data as $line) {
            fputcsv($file, (array) $line);
        }
        fclose($file);
    }

    public static function getCsvPathForLanguage(string $language): string
    {
        $csvPaths = [
            LanguageHelper::FR_LANGUAGE => self::FR_TRANSLATION_CSV_PATH,
            LanguageHelper::EN_LANGUAGE => self::EN_TRANSLATION_CSV_PATH,
        ];

        return $csvPaths[$language];
    }

}