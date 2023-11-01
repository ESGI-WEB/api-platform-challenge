<?php

declare(strict_types=1);

namespace App\ValueObject;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\State\TranslationStateProcessor;
use App\State\TranslationStateProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
    ],
    normalizationContext: ['groups' => ['translation:read']],
    provider: TranslationStateProvider::class,
    processor: TranslationStateProcessor::class
)]
class Translation
{
    #[ApiProperty(identifier: true)]
    #[Groups(['translation:read'])]
    protected string $language;

    #[ApiProperty(identifier: true)]
    #[Groups(['translation:read'])]
    protected string $key;

    #[ApiProperty(identifier: false)]
    #[Groups(['translation:read'])]
    protected string $value;

    public function __construct(string $language = '', string $key = '', string $value = '') {
        $this->language = $language;
        $this->key = $key;
        $this->value = $value;
    }

    public function getLanguage(): string
    {
        return $this->language;
    }

    public function setLanguage(string $language): void
    {
        $this->language = $language;
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function setKey(string $key): void
    {
        $this->key = $key;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): void
    {
        $this->value = $value;
    }
}