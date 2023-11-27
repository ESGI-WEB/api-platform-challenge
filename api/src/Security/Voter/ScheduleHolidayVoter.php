<?php

namespace App\Security\Voter;

use ApiPlatform\Doctrine\Orm\AbstractPaginator;
use ApiPlatform\Doctrine\Orm\Paginator;
use App\Entity\Holiday;
use App\Entity\Organisation;
use App\Entity\Schedule;
use App\Entity\User;
use App\Enum\RolesEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ScheduleHolidayVoter extends Voter
{
    public const VIEW_FOR_ORGANISATION = 'VIEW_FOR_ORGANISATION';
    public const VIEW_FOR_USER = 'VIEW_FOR_USER';
    public const CREATE = 'CREATE';
    public const EDIT = 'EDIT';

    private Security $security;
    private RequestStack $requestStack;

    public function __construct(Security $security, RequestStack $requestStack)
    {
        $this->security = $security;
        $this->requestStack = $requestStack;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW_FOR_ORGANISATION, self::VIEW_FOR_USER, self::CREATE, self::EDIT])
            && ($subject instanceof Schedule || $subject instanceof Holiday || $subject instanceof AbstractPaginator);
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
            self::VIEW_FOR_ORGANISATION => $this->canViewOrganisationSchedules($user),
            self::VIEW_FOR_USER => $this->canViewUserSchedules($user),
            self::CREATE, self::EDIT => $this->canCreateOrEditSchedule($subject, $user),
            default => false,
        };
    }

    private function canViewOrganisationSchedules(User $user): bool
    {
        $organisationQueried = intval($this->requestStack->getCurrentRequest()->attributes->get('organisation_id'));
        return $user->getOrganisations()->exists(
            fn(int $key, Organisation $organisation) => $organisation->getId() === $organisationQueried
        );
    }

    private function canViewUserSchedules(User $user): bool
    {
        $isQueryingForHimself = intval(
                $this->requestStack->getCurrentRequest()->attributes->get('user_id')
            ) === $user->getId();
        return $isQueryingForHimself || $this->security->isGranted(RolesEnum::PROVIDER->value, $user);
    }

    private function canCreateOrEditSchedule($subject, User $user): bool
    {
        if (!$subject instanceof Schedule && !$subject instanceof Holiday) {
            return false;
        }

        if (!$this->security->isGranted(RolesEnum::PROVIDER->value)) {
            return false;
        }

        $isSubjectLinkedToOrganisation = fn(int $key, Organisation $organisation) =>
            $organisation->getId() === $subject->getOrganisation()->getId();

        // il faut que le user qui créé appartienne à l'organisation pour laquelle il ajouter un schedule/holiday
        $isLinkedToTargetOrganisation = $user->getOrganisations()->exists($isSubjectLinkedToOrganisation);
        if (!$isLinkedToTargetOrganisation) {
            return false;
        }

        // il faut que le user pour lequel est ajouté le schedule fasse partie de l'organisation aussi
        $isLinkedToTargetUser = $subject->getProvider()->getOrganisations()->exists($isSubjectLinkedToOrganisation);
        if (!$isLinkedToTargetUser) {
            return false;
        }

        return true;
    }
}
