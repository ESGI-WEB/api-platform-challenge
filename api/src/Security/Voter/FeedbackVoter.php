<?php

namespace App\Security\Voter;

use ApiPlatform\Doctrine\Orm\AbstractPaginator;
use ApiPlatform\Doctrine\Orm\Paginator;
use App\Entity\Feedback;
use App\Entity\Holiday;
use App\Entity\Organisation;
use App\Entity\Schedule;
use App\Entity\User;
use App\Enum\RolesEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class FeedbackVoter extends Voter
{
    public const CREATE = 'CREATE_FEEBACK';

    private Security $security;
    private RequestStack $requestStack;

    public function __construct(Security $security, RequestStack $requestStack)
    {
        $this->security = $security;
        $this->requestStack = $requestStack;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::CREATE])
            && ($subject instanceof Feedback);
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
            default => false,
        };
    }

    private function canCreate($subject): bool
    {
        if (!$this->security->isGranted(RolesEnum::PROVIDER->value)) {
            return false;
        }

        // il faut que le service soit lié à une des organisations de l'utilisateur
        return $subject->getService()->getOrganisation()->getUsers()->filter(fn (User $user) => $user->getId() === $this->security->getUser()->getId());
    }
}
