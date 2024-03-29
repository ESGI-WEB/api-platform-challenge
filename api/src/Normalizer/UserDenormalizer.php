<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Entity\User;
use App\Enum\RolesEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class UserDenormalizer implements DenormalizerInterface
{
    public function __construct(
        protected Security $security,
        protected PasswordHasherFactoryInterface $hasher,
        protected ObjectNormalizer $normalizer,
    ) {}

    public function denormalize(mixed $data, string $type, string $format = null, array $context = []): mixed
    {
        $user = $this->normalizer->denormalize($data, $type, $format, $context);

        assert($user instanceof User);

        $plainPassword = $user->getPlainPassword();

        if (empty($plainPassword)) {
            return $user;
        }

        $hasher = $this->hasher->getPasswordHasher($user);
        $hashedPassword = $hasher->hash($plainPassword);

        $user->setPassword($hashedPassword);
        $user->eraseCredentials();

        //Only set this two roles

        if ($user->file !== null) {
            $user->setRoles([RolesEnum::PROVIDER_TO_VALIDATE->value]);
        }

        if ($user->registerAsEmployee) {
            $user->setRoles([RolesEnum::EMPLOYEE->value]);
        }

        return $user;
    }

    public function supportsDenormalization(mixed $data, string $type, string $format = null): bool
    {
        return $type === User::class;
    }
}
