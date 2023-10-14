<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\GroupsEnum;
use App\Enum\RolesEnum;
use App\Security\Voter\UserVoter;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(security: "is_granted('" . UserVoter::VIEW . "', object)"),
        new GetCollection(security: "is_granted('" . RolesEnum::ADMIN->value . "')"),
        new Post(
            denormalizationContext: ['groups' => [GroupsEnum::USER_WRITE->value, GroupsEnum::USER_CREATE->value]],
            validationContext: ['groups' => [GroupsEnum::USER_CREATE->value]],
        ),
        new Put(
            denormalizationContext: ['groups' => [GroupsEnum::USER_WRITE->value]],
            security: "is_granted('" . UserVoter::EDIT . "', object)"
        ),
        new Patch(
            denormalizationContext: ['groups' => [GroupsEnum::USER_WRITE->value]],
            security: "is_granted('" . UserVoter::EDIT . "', object)"
        ),
        new Delete(security: "is_granted('" . UserVoter::DELETE . "', object)"),
    ],
    normalizationContext: ['groups' => [GroupsEnum::USER_READ->value]],
)]
#[UniqueEntity(fields: ['email'])]
#[ORM\Table(name: '`user`')]
#[ORM\Entity]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups([GroupsEnum::USER_READ->value])]
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[Groups([GroupsEnum::USER_READ->value, GroupsEnum::USER_WRITE_ADMIN->value])]
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    #[Assert\NotBlank(groups: [GroupsEnum::USER_CREATE->value])] // set by UserDenormalizer
    private string $password = '';

    #[Groups([GroupsEnum::USER_WRITE->value, GroupsEnum::USER_CREATE->value])]
    private ?string $plainPassword = null;

    #[Groups([GroupsEnum::USER_READ->value, GroupsEnum::USER_WRITE->value])]
    #[Assert\Email]
    #[Assert\NotBlank]
    #[ORM\Column(length: 180, unique: true)]
    private string $email = '';

    #[Groups([GroupsEnum::USER_READ->value])]
    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /** @see UserInterface */
    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    /** @see UserInterface */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = RolesEnum::USER->value; // guarantee every user at least has ROLE_USER

        return array_unique($roles);
    }

    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }

    /** @see PasswordAuthenticatedUserInterface */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function setPlainPassword(?string $plainPassword): void
    {
        $this->plainPassword = $plainPassword;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    /** @see UserInterface */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }
}
