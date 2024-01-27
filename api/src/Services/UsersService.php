<?php

namespace App\Services;

use App\Entity\Organisation;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

readonly class UsersService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function addUser(int $organisationId, User $user): void
    {
        $organisation = $this->entityManager->getRepository(Organisation::class)->find($organisationId);

        if (!$organisation) {
            throw new UnprocessableEntityHttpException('User is already in this organisation');
        }

        $organisation->addUser($user);
        $this->entityManager->flush();
    }

    public function removeUser(int $id, User $user): void
    {
        $organisation = $this->entityManager->getRepository(Organisation::class)->find($id);

        if (!$organisation) {
            throw new NotFoundHttpException('No organisation found for id ' . $id);
        }

        $organisation->removeUser($user);
        $this->entityManager->flush();
    }
}
