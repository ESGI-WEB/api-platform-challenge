<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Utils\TranslationsCsvFileHelper;
use App\Utils\LanguageHelper;
use App\ValueObject\Translation;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\KernelInterface;

class TranslationStateProvider implements ProviderInterface
{
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
                throw new \Exception('Invalid parameters.', self::INVALID_PARAMETERS_ERROR);
            }

            return $this->findTranslationByKeyAndLanguage($key, $language);
        }

        $language = $this->requestStack->getCurrentRequest()->query->get('language');

        if (!LanguageHelper::validateLanguage($language)) {
            throw new \Exception('Invalid language.', self::INVALID_PARAMETERS_ERROR);
        }

        $csvPath = TranslationsCsvFileHelper::getCsvPathForLanguage($language);
        $filePath = $this->getCompleteCsvFilePath($csvPath);

        return TranslationsCsvFileHelper::readCsvFile($filePath);
    }

    /**
     * @throws \Exception
     */
    protected function findTranslationByKeyAndLanguage(string $key, string $language): ?Translation
    {
        $csvPath = TranslationsCsvFileHelper::getCsvPathForLanguage($language);
        $filePath = $this->getCompleteCsvFilePath($csvPath);

        $translations = TranslationsCsvFileHelper::readCsvFile($filePath);

        foreach ($translations as $translation) {
            if ($translation->getKey() === $key && $translation->getLanguage() === $language) {
                return $translation;
            }
        }
        throw new \Exception('Translation not found.', self::TRANSLATION_NOT_FOUND_ERROR);
    }

    protected function getCompleteCsvFilePath(string $csvPath): string
    {
        return $this->kernel->getProjectDir() . $csvPath;
    }
}