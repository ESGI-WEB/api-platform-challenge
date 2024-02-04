<?php

namespace App\Security\Voter;

use ApiPlatform\Doctrine\Orm\AbstractPaginator;
use ApiPlatform\Doctrine\Orm\Paginator;
use App\Entity\Answer;
use App\Entity\Feedback;
use App\Entity\Holiday;
use App\Entity\Organisation;
use App\Entity\Schedule;
use App\Entity\User;
use App\Enum\AppointmentStatusEnum;
use App\Enum\RolesEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class AnswerVoter extends Voter
{
    public const CREATE = 'CREATE_ANSWER';
    public const READ = 'READ_ANSWER';

    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::CREATE, self::READ])
            && ($subject instanceof Answer);
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
            self::CREATE => $this->canCreate($subject, $user),
            self::READ => $this->canRead($subject, $user),
            default => false,
        };
    }

    private function canCreate(Answer $answer, User $user): bool
    {
        return $answer->getAppointment()->getDatetime() > new \DateTimeImmutable() &&
            $answer->getAppointment()->getStatus() === AppointmentStatusEnum::valid->value &&
            $user === $answer->getAppointment()->getClient();
    }

    private function canRead(Answer $answer, User $user): bool
    {
        return $user === $answer->getAppointment()->getClient() || $user === $answer->getAppointment()->getProvider();
    }
}
