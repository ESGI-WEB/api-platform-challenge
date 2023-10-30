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
    public const TRANSLATION_CSV_PATH = '/var/uploads/translation.csv';

    public function __construct(
        protected KernelInterface $kernel,
        protected RequestStack $requestStack
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?array
    {
        $content = $this->getTranslationsData();

        if (!$operation instanceof CollectionOperationInterface) {
            return null;
        }

        $language = $this->requestStack->getCurrentRequest()->query->get('language');

        if ($language !== null) {
            $content = array_filter($content, function (Translation $translation) use ($language) {
                return $translation->getLanguage() === $language;
            });
        }

        return $content;
    }

    protected function getTranslationsData(): array
    {
        $result = [];
        $filePath = $this->kernel->getProjectDir() . self::TRANSLATION_CSV_PATH;

        if (file_exists($filePath)) {
            $file = fopen($filePath, 'rb');

            while (($line = fgetcsv($file)) !== false) {
                $language = $line[0];
                $key = $line[1];
                $value = $line[2];

                $result[] = new Translation($language, $key, $value);
            }
            fclose($file);
        }

        return $result;
    }
}