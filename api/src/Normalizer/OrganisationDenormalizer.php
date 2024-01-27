<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Entity\Organisation;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Ramsey\Uuid\Uuid;


class OrganisationDenormalizer implements DenormalizerInterface
{
    protected Security $security;
    protected ObjectNormalizer $normalizer;

    public function __construct(Security $security, ObjectNormalizer $normalizer)
    {
        $this->security = $security;
        $this->normalizer = $normalizer;
    }

    public function denormalize(mixed $data, string $type, string $format = null, array $context = []): mixed
    {
        $organisation = $this->normalizer->denormalize($data, $type, $format, $context);

        assert($organisation instanceof Organisation);

        if (empty($organisation->getUuid())) {
            $organisation->setUuid(Uuid::uuid4()->toString());
        }

        if (empty($organisation->getCreatedAt())) {
            $organisation->setCreatedAt(new \DateTimeImmutable());
        }

        if (count($organisation->getUsers())|| $this->security->getUser() === null) {
            return $organisation;
        }

        $organisation->addUser($this->security->getUser());

        return $organisation;
    }

    public function supportsDenormalization(mixed $data, string $type, string $format = null): bool
    {
        return $type === Organisation::class;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [Organisation::class];
    }
}
