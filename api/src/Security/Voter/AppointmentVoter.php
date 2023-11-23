<?php

namespace App\Security\Voter;

use ApiPlatform\Doctrine\Orm\Paginator;
use App\Entity\Appointment;
use App\Entity\Holiday;
use App\Entity\Organisation;
use App\Entity\Schedule;
use App\Entity\User;
use App\Enum\RolesEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class AppointmentVoter extends Voter
{
    public const CREATE = 'CREATE';

    private RequestStack $requestStack;
    private Security $security;

    public function __construct(Security $security, RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->security = $security;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::CREATE])
            && ($subject instanceof Appointment);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::CREATE => $this->canCreateAppointment($user, $subject),
            default => false,
        };
    }

    private function canCreateAppointment(User $user, Appointment $appointment): bool
    {
        // check qu'il ajoute le rdv pour lui même ou que c'est un au moins un provider
        if ($user->getId() !== $appointment->getClient()->getId() && !$this->security->isGranted(RolesEnum::PROVIDER->value)) {
            return false;
        }

        // check que la date de rdv est bien disponible
    }
}
