<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\State\ProcessorInterface;
use App\ValueObject\Translation;
use Symfony\Component\HttpKernel\KernelInterface;

class TranslationStateProcessor implements ProcessorInterface
{
    public function __construct(
        protected KernelInterface $kernel
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof Translation || !$operation instanceof Patch) {
            return;
        }

        if (!$this->validateLanguage($data->getLanguage())) {
            throw new \Exception('Invalid language.', TranslationStateProvider::INVALID_PARAMETERS_ERROR);
        }

        $csvPath = $this->getCsvPathForLanguage($data->getLanguage());
        $existingTranslations = $this->readFromCsv($csvPath);
        $newTranslation = [$data->getLanguage(), $data->getKey(), $data->getValue()];

        $this->updateInFile($existingTranslations, $newTranslation, $csvPath);
    }

    protected function validateLanguage(string $language): bool
    {
        return in_array($language, [TranslationStateProvider::FR_LANGUAGE, TranslationStateProvider::EN_LANGUAGE]);
    }

    protected function getCsvPathForLanguage(string $language): string
    {
        $csvPaths = [
            TranslationStateProvider::FR_LANGUAGE => TranslationStateProvider::FR_TRANSLATION_CSV_PATH,
            TranslationStateProvider::EN_LANGUAGE => TranslationStateProvider::EN_TRANSLATION_CSV_PATH,
        ];

        return $csvPaths[$language];
    }

    protected function readFromCsv(string $csvPath): array
    {
        $filePath = $this->kernel->getProjectDir() . $csvPath;

        if (!file_exists($filePath)) {
            return [];
        }

        $file = fopen($filePath, TranslationStateProvider::READ_CSV_FILE);
        $data = [];
        while (($row = fgetcsv($file)) !== false) {
            $data[] = $row;
        }
        fclose($file);

        return $data;
    }

    protected function updateInFile(array &$existingTranslations, array $newTranslation, string $csvPath): void
    {
        foreach ($existingTranslations as &$line) {
            if ($line[0] === $newTranslation[0] && $line[1] === $newTranslation[1]) {
                $line = $newTranslation;
                break;
            }
        }

        $this->writeUpdatedDataToCsv($existingTranslations, $csvPath);
    }

    protected function writeUpdatedDataToCsv(array $data, string $csvPath): void
    {
        $filePath = $this->kernel->getProjectDir() . $csvPath;
        $file = fopen($filePath, TranslationStateProvider::WRITE_CSV_FILE);
        foreach ($data as $line) {
            fputcsv($file, $line);
        }
        fclose($file);
    }
}