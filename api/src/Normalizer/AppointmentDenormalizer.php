<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Entity\Appointment;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class AppointmentDenormalizer implements DenormalizerInterface
{
    public function __construct(
        protected Security $security,
        protected PasswordHasherFactoryInterface $hasher,
        protected ObjectNormalizer $normalizer,
    ) {}

    public function denormalize(mixed $data, string $type, string $format = null, array $context = []): mixed
    {
        $appointment = $this->normalizer->denormalize($data, $type, $format, $context);

        assert($appointment instanceof Appointment);

        if (!$appointment->getClient()) { // or voter will check if user has right to specify client
            $appointment->setClient($this->security->getUser());
        }

        return $appointment;
    }

    public function supportsDenormalization(mixed $data, string $type, string $format = null): bool
    {
        return $type === Appointment::class;
    }
}
