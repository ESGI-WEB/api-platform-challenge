<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ValueObject\Translation;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\KernelInterface;

class TranslationStateProvider implements ProviderInterface
{
    public const WRITE_CSV_FILE = 'w';
    public const READ_CSV_FILE = 'r';
    public const EN_TRANSLATION_CSV_PATH = '/src/Translations/translations_en.csv';
    public const FR_TRANSLATION_CSV_PATH = '/src/Translations/translations_fr.csv';
    public const FR_LANGUAGE = 'fr';
    public const EN_LANGUAGE = 'en';
    public const INVALID_PARAMETERS_ERROR = 400;
    public const TRANSLATION_NOT_FOUND_ERROR = 404;

    public function __construct(
        protected KernelInterface $kernel,
        protected RequestStack $requestStack
    ) {}

    /**
     * @throws \Exception
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|Translation|null
    {
        if (!$operation instanceof CollectionOperationInterface) {
            $key = $uriVariables['key'] ?? null;
            $language = $uriVariables['language'] ?? null;

            if ($key === null || $language === null) {
                throw new \InvalidArgumentException('Invalid parameters.', self::INVALID_PARAMETERS_ERROR);
            }

            $translation = $this->findTranslationByKeyAndLanguage($key, $language);

            if ($translation === null) {
                throw new \Exception('Translation not found.', self::TRANSLATION_NOT_FOUND_ERROR);
            }

            return $translation;
        }

        $language = $this->getRequestedLanguage();

        if (!$this->validateLanguage($language)) {
            throw new \RuntimeException('Invalid language.', self::INVALID_PARAMETERS_ERROR);
        }

        return $this->getTranslationsData($language);
    }

    protected function findTranslationByKeyAndLanguage(string $key, string $language): ?Translation
    {
        $translations = $this->getTranslationsData($language);

        foreach ($translations as $translation) {
            if ($translation->getKey() === $key && $translation->getLanguage() === $language) {
                return $translation;
            }
        }

        return null;
    }

    protected function getRequestedLanguage(): ?string
    {
        return $this->requestStack->getCurrentRequest()->query->get('language');
    }

    protected function getTranslationsData(string $language): array
    {
        $csvPath = $this->getCsvPathForLanguage($language);
        $filePath = $this->kernel->getProjectDir() . $csvPath;

        if (!file_exists($filePath)) {
            return [];
        }

        $result = [];
        $file = fopen($filePath, self::READ_CSV_FILE);

        while (($line = fgetcsv($file)) !== false) {
            $result[] = new Translation($line[0], $line[1], $line[2]);
        }
        fclose($file);

        return $result;
    }

    protected function getCsvPathForLanguage(string $language): string
    {
        $csvPaths = [
            self::FR_LANGUAGE => self::FR_TRANSLATION_CSV_PATH,
            self::EN_LANGUAGE => self::EN_TRANSLATION_CSV_PATH,
        ];

        return $csvPaths[$language];
    }

    protected function validateLanguage(string $language): bool
    {
        return in_array($language, [self::FR_LANGUAGE, self::EN_LANGUAGE]);
    }
}