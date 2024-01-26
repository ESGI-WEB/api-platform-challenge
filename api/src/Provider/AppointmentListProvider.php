<?php

namespace App\Provider;

use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\Pagination;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use Symfony\Bundle\SecurityBundle\Security;

readonly class AppointmentListProvider implements ProviderInterface
{
    public function __construct(
        private AppointmentRepository $appointmentRepository,
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

        $filters = $context['filters'] ?? [];

        // check if request is paginated
        if (!$this->pagination->isEnabled($operation, $context)) {
            return $this->appointmentRepository->findAppointmentsByOrganisationQuery($uriVariables['id'], $filters, $user->getId())->getResult();
        }

        [$page, , $limit] = $this->pagination->getPagination($operation, $context);

        return new Paginator($this->appointmentRepository->findAppointmentsByOrganisationPaginated($uriVariables['id'], $filters, $page, $limit, $user->getId()));
    }
}