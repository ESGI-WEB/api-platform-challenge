<?php

namespace App\Security\Voter;

use App\Entity\User;
use App\Enum\RolesEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class UserVoter extends Voter
{
    public const VIEW = 'VIEW_USER';
    public const EDIT = 'EDIT_USER';
    public const DELETE = 'DELETE_USER';

    private Security $security;
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW, self::DELETE])
            && $subject instanceof User;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        if ($this->security->isGranted(RolesEnum::ADMIN->value)) {
            return true;
        }

        return match ($attribute) {
            self::EDIT => $this->canEdit($subject, $user),
            self::VIEW => $this->canView($subject, $user),
            self::DELETE => $this->canDelete($subject, $user),
            default => false,
        };
    }

    private function canEdit(User $subject, UserInterface $user): bool
    {
        if ($this->security->isGranted(RolesEnum::PROVIDER_TO_VALIDATE->value)) {
            return false;
        }
        return $user === $subject;
    }

    private function canView(User $subject, UserInterface $user): bool
    {
        return $user === $subject;
    }

    private function canDelete(User $subject, UserInterface $user): bool
    {
        return $user === $subject;
    }
}
