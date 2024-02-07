<?php

namespace App\Provider;

use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\Pagination;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Enum\RolesEnum;
use App\Repository\AnswerRepository;
use App\Repository\FeedbackRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;

readonly class AnswersProvider implements ProviderInterface
{
    public function __construct(
        private AnswerRepository $answerRepository,
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

        if (!$user instanceof User || !$this->security->isGranted(RolesEnum::EMPLOYEE->value)) {
            return null;
        }

        // check if request is paginated
        if (!$this->pagination->isEnabled($operation, $context)) {
            return $this->answerRepository->getAnswersFor($user);
        }

        [$page, , $limit] = $this->pagination->getPagination($operation, $context);
        return new Paginator($this->answerRepository->getAnswersPaginatedFor($user, $page, $limit));
    }
}