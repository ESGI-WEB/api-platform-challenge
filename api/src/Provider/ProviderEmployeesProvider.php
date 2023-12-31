<?php

namespace App\Provider;

use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\Pagination;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;

readonly class ProviderEmployeesProvider implements ProviderInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private Security $security,
        private Pagination $pagination,
    ) {
    }

    /**
     * @throws \Exception
     */
    public function provide(
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): object|array|null {
        if (!$operation instanceof CollectionOperationInterface) {
            return null;
        }

        /** @var User $user */
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return null;
        }

        // check if request is paginated
        if (!$this->pagination->isEnabled($operation, $context)) {
            return $this->userRepository->findEmployees($user);
        }

        [$page, , $limit] = $this->pagination->getPagination($operation, $context);
        return new Paginator($this->userRepository->findEmployeesPaginated($user, $page, $limit));
    }
}