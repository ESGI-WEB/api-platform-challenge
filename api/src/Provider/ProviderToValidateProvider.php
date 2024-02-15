<?php

namespace App\Provider;

use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\Pagination;
use ApiPlatform\State\ProviderInterface;
use App\Repository\UserRepository;

readonly class ProviderToValidateProvider implements ProviderInterface
{
    public function __construct(
        private UserRepository $userRepository,
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

        // check if request is paginated
        if (!$this->pagination->isEnabled($operation, $context)) {
            return $this->userRepository->findProvidersToValidate();
        }

        [$page, , $limit] = $this->pagination->getPagination($operation, $context);
        return new Paginator($this->userRepository->findProvidersToValidatePaginated($page, $limit));
    }
}