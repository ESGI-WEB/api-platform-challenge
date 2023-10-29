<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\ValueObject\Translation;
use Symfony\Component\HttpKernel\KernelInterface;

class TranslationStateProcessor implements ProcessorInterface
{
    public function __construct(
        protected KernelInterface $kernel,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof Translation || !$operation instanceof Post) {
            return;
        }

        $data = [$data->getLanguage(), $data->getKey(), $data->getValue()];
        $this->writeInFile($data);
    }

    protected function writeInFile(array $data): void
    {
        $filePath = $this->kernel->getProjectDir() . TranslationStateProvider::TRANSLATION_CSV_PATH;
        $file = fopen($filePath, 'wb');
        fputcsv($file, $data);
        fclose($file);
    }
}