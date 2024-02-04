<?php

namespace App\Security\Voter;

use ApiPlatform\Doctrine\Orm\AbstractPaginator;
use ApiPlatform\Doctrine\Orm\Paginator;
use App\Entity\Feedback;
use App\Entity\Holiday;
use App\Entity\Organisation;
use App\Entity\Schedule;
use App\Entity\Service;
use App\Entity\User;
use App\Enum\RolesEnum;
use App\Repository\ServiceRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class FeedbackVoter extends Voter
{
    public const CREATE = 'CREATE_FEEBACK';
    public const DELETE = 'DELETE_FEEBACK';
    public const READ = 'READ_FEEBACK';
    public const LIST = 'LIST_FEEBACK';

    private Security $security;
    private RequestStack $requestStack;
    private ServiceRepository $serviceRepository;

    public function __construct(Security $security, RequestStack $requestStack, ServiceRepository $serviceRepository)
    {
        $this->security = $security;
        $this->requestStack = $requestStack;
        $this->serviceRepository = $serviceRepository;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::CREATE, self::DELETE, self::READ, self::LIST])
            && ($subject instanceof Feedback || $subject instanceof AbstractPaginator);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        if ($this->security->isGranted(RolesEnum::ADMIN->value)) {
            return true;
        }

        return match ($attribute) {
            self::CREATE => $this->canCreate($subject),
            self::DELETE => $this->canDelete($subject),
            self::READ => $this->feedbackBelongToUser($subject),
            self::LIST => $this->canList($subject),
            default => false,
        };
    }

    private function canCreate(Feedback $subject): bool
    {
        if (!$this->security->isGranted(RolesEnum::PROVIDER->value)) {
            return false;
        }

        return $this->feedbackBelongToUser($subject);
    }

    private function canDelete(Feedback $subject): bool
    {
        if (!$this->security->isGranted(RolesEnum::PROVIDER->value)) {
            return false;
        }

        if (!$this->feedbackBelongToUser($subject)) {
            return false;
        }

        return $subject->getAnswers()->isEmpty();
    }

    private function canList(AbstractPaginator $subject): bool
    {
        if (!$this->security->isGranted(RolesEnum::PROVIDER->value)) {
            return false;
        }

        $serviceIdQueried = $this->requestStack->getCurrentRequest()->attributes->get('id');
        $service = $this->serviceRepository->find($serviceIdQueried);
        return $service->getOrganisation()->getUsers()->filter(
            fn (User $user) => $user->getId() === $this->security->getUser()->getId()
        )->count() > 0;
    }

    private function feedbackBelongToUser($subject): bool
    {
        // il faut que le service soit lié à une des organisations de l'utilisateur
        return $subject->getService()->getOrganisation()->getUsers()->filter(fn (User $user) => $user->getId() === $this->security->getUser()->getId())
            ->count() > 0;
    }
}
