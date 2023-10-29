<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\HttpKernel\KernelInterface;

class TranslationStateProvider implements ProviderInterface
{
    public const TRANSLATION_CSV_PATH = '/var/uploads/translation.csv';

    public function __construct(
        protected KernelInterface $kernel
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?array
    {
        $content = $this->getTranslationsData();

        if (!$operation instanceof CollectionOperationInterface) {
            return null;
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

                if (!isset($result[$language])) {
                    $result[$language] = [];
                }

                $result[$language][$key] = $value;
            }
            fclose($file);
        }

        return $result;
    }
}