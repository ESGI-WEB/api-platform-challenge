<?php

namespace App\Security\Voter;

use ApiPlatform\Doctrine\Orm\AbstractPaginator;
use ApiPlatform\Doctrine\Orm\Paginator;
use App\Entity\Appointment;
use App\Entity\Holiday;
use App\Entity\Organisation;
use App\Entity\Schedule;
use App\Entity\User;
use App\Enum\AppointmentStatusEnum;
use App\Enum\RolesEnum;
use App\Services\SlotsService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class OrganisationVoter extends Voter
{
    public const USER_READ_ORGANISATIONS = 'USER_READ_ORGANISATIONS';

    public function __construct(
        private readonly Security $security,
        private readonly RequestStack $requestStack
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::USER_READ_ORGANISATIONS])
            && ($subject instanceof Organisation || $subject instanceof AbstractPaginator);
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
            self::USER_READ_ORGANISATIONS => $this->canUserReadOrganisations($user),
            default => false,
        };
    }

    private function canUserReadOrganisations(User $user): bool
    {
        $userQueried = intval($this->requestStack->getCurrentRequest()->attributes->get('user_id'));
        return $this->security->isGranted(RolesEnum::PROVIDER->value) && $user->getId() === $userQueried;
    }
}
