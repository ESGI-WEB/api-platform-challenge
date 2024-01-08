<?php

declare(strict_types=1);

namespace App\EventListener;

use Doctrine\ORM\EntityRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTCreatedListener
{
    private $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function onJwtCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();

        $payload = $event->getData();
        $payload['id'] = $user->getId();

        $event->setData($payload);
    }
}

