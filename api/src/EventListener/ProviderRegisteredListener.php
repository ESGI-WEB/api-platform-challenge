<?php

namespace App\EventListener;

use App\Entity\User;
use App\Enum\RolesEnum;
use App\Services\EmailService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, entity: User::class)]
class ProviderRegisteredListener
{
    public function __construct(
        private readonly EmailService $emailService,
        private readonly string $emailSender
    ) { }

    public function postPersist(User $user, PostPersistEventArgs $event): void
    {
        $emailAdmin = $this->emailSender;

        if (in_array(RolesEnum::PROVIDER->value, $user->getRoles()) && $emailAdmin !== null) {
            $this->emailService->sendValidationEmail($emailAdmin, $user);
        }
    }
}