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

class AppointmentVoter extends Voter
{
    public const CREATE = 'CREATE_APPOINTMENT';
    public const CLIENT_READ_COLLECTION = 'CLIENT_READ_APPOINTMENT_COLLECTION';
    public const CLIENT_READ = 'CLIENT_READ_APPOINTMENT';
    public const CLIENT_UPDATE = 'CLIENT_UPDATE_APPOINTMENT';
    public const EMPLOYEE_READ_COLLECTION = 'EMPLOYEE_READ_COLLECTION';
    public const EMPLOYEE_READ = 'EMPLOYEE_READ';
    public const PROVIDER_ORGANISATION_APPOINTMENTS_READ = 'PROVIDER_ORGANISATION_APPOINTMENTS_READ';

    public function __construct(
        private readonly Security $security,
        private readonly SlotsService $slotsService,
        private readonly RequestStack $requestStack
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array(
                $attribute,
                [
                    self::CREATE,
                    self::CLIENT_READ_COLLECTION,
                    self::CLIENT_READ,
                    self::EMPLOYEE_READ_COLLECTION,
                    self::EMPLOYEE_READ,
                    self::CLIENT_UPDATE,
                    self::PROVIDER_ORGANISATION_APPOINTMENTS_READ
                ]
            )
            && ($subject instanceof Appointment || $subject instanceof AbstractPaginator || is_array($subject));
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::CREATE => $this->canCreateAppointment($user, $subject),
            self::CLIENT_READ_COLLECTION => $this->canClientReadAppointmentCollection($user),
            self::CLIENT_READ => $this->canClientReadAppointment($user, $subject),
            self::EMPLOYEE_READ_COLLECTION => $this->canEmployeeReadAppointmentCollection($user),
            self::EMPLOYEE_READ => $this->canEmployeeReadAppointment($user, $subject),
            self::CLIENT_UPDATE => $this->canClientUpdateAppointment($user, $subject),
            self::PROVIDER_ORGANISATION_APPOINTMENTS_READ => $this->canProviderReadOrgaAppointments($user),
            default => false,
        };
    }

    private function canClientReadAppointmentCollection(User $user): bool
    {
        $userQueried = intval($this->requestStack->getCurrentRequest()->attributes->get('user_id'));
        return $user->getId() === $userQueried;
    }

    private function canClientReadAppointment(User $user, Appointment $appointment): bool
    {
        return $user->getId() === $appointment->getClient()->getId();
    }

    private function canEmployeeReadAppointmentCollection(User $user): bool
    {
        if (!$this->security->isGranted(RolesEnum::EMPLOYEE->value)) {
            return false;
        }

        $userQueried = intval($this->requestStack->getCurrentRequest()->attributes->get('provider_id'));
        return $user->getId() === $userQueried;
    }

    private function canEmployeeReadAppointment(User $user, Appointment $appointment): bool
    {
        if (!$this->security->isGranted(RolesEnum::EMPLOYEE->value)) {
            return false;
        }

        return $user->getId() === $appointment->getProvider()->getId();
    }

    private function canClientUpdateAppointment(User $user, Appointment $appointment): bool
    {
        return $appointment->getStatus() == AppointmentStatusEnum::valid->value &&
            $appointment->getDatetime() > new \DateTimeImmutable(
            ) && // may we must prevent updating if appointment is in less than 48h ?
            $user->getId() === $appointment->getClient()->getId();
    }

    /**
     * @throws \Exception
     */
    private function canCreateAppointment(User $user, Appointment $appointment): bool
    {
        // check qu'il ajoute le rdv pour lui même ou que c'est un au moins un provider
        if ($user->getId() !== $appointment->getClient()->getId() && !$this->security->isGranted(
                RolesEnum::PROVIDER->value
            )) {
            return false;
        }

        if (!$appointment->getService()->getOrganisation()->getUsers()->contains($appointment->getProvider())) {
            return false;
        }

        // check que la date de rdv est bien disponible
        return !empty(
            $this->slotsService->getAvailableSlots(
                $appointment->getService()->getOrganisation()->getId(),
                $appointment->getDatetime(),
                $appointment->getProvider()->getId()
            )
        );
    }

    private function canProviderReadOrgaAppointments(User $user): bool
    {
        if (!$this->security->isGranted(RolesEnum::PROVIDER->value)) {
            return false;
        }

        $organisationId = intval($this->requestStack->getCurrentRequest()->attributes->get('organisation_id'));
        return $user->getOrganisations()->filter(function (Organisation $organisation) use ($organisationId) {
                return $organisation->getId() === $organisationId;
            }) > 0;
    }
}
