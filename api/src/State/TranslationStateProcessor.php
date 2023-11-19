<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\State\ProcessorInterface;
use App\Utils\TranslationsCsvFileHelper;
use App\Utils\LanguageHelper;
use App\ValueObject\Translation;
use Symfony\Component\HttpKernel\KernelInterface;

class TranslationStateProcessor implements ProcessorInterface
{
    public function __construct(
        protected KernelInterface $kernel
    ) {}

    /**
     * @throws \Exception
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof Translation || !$operation instanceof Patch) {
            return;
        }

        $language = $data->getLanguage();

        if (!LanguageHelper::validateLanguage($language)) {
            throw new \Exception('Invalid language.', TranslationStateProvider::INVALID_PARAMETERS_ERROR);
        }

        $csvPath = TranslationsCsvFileHelper::getCsvPathForLanguage($language);
        $existingTranslations = TranslationsCsvFileHelper::readCsvFile($this->getCompleteCsvFilePath($csvPath));
        $newTranslation = new Translation($language, $data->getKey(), $data->getValue());

        $this->updateInFile($existingTranslations, $newTranslation, $csvPath);
    }

    protected function getCompleteCsvFilePath(string $csvPath): string
    {
        return $this->kernel->getProjectDir() . $csvPath;
    }

    protected function updateInFile(array &$existingTranslations, Translation $newTranslation, string $csvPath): void
    {
        foreach ($existingTranslations as &$line) {
            if ($line->getLanguage() === $newTranslation->getLanguage() && $line->getKey() === $newTranslation->getKey()) {
                $line = $newTranslation;
                break;
            }
        }
        TranslationsCsvFileHelper::writeCsvFile($this->getCompleteCsvFilePath($csvPath), $existingTranslations);
    }
}