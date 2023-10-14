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
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    #[ORM\ManyToMany(targetEntity: Organisation::class, mappedBy: 'creator')]
    private Collection $organisations;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[ORM\Column]
    private ?bool $providerValidated = null;

    #[ORM\OneToOne(mappedBy: 'user_id', cascade: ['persist', 'remove'])]
    private ?Schedule $schedule = null;

    #[ORM\OneToMany(mappedBy: 'user_id', targetEntity: Holiday::class, orphanRemoval: true)]
    private Collection $holidays;

    #[ORM\OneToMany(mappedBy: 'client_id', targetEntity: Appointment::class, orphanRemoval: true)]
    private Collection $appointments;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->organisations = new ArrayCollection();
        $this->holidays = new ArrayCollection();
        $this->appointments = new ArrayCollection();
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

    /**
     * @return Collection<int, Organisation>
     */
    public function getOrganisations(): Collection
    {
        return $this->organisations;
    }

    public function addOrganisation(Organisation $organisation): static
    {
        if (!$this->organisations->contains($organisation)) {
            $this->organisations->add($organisation);
            $organisation->addCreator($this);
        }

        return $this;
    }

    public function removeOrganisation(Organisation $organisation): static
    {
        if ($this->organisations->removeElement($organisation)) {
            $organisation->removeCreator($this);
        }

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function isProviderValidated(): ?bool
    {
        return $this->providerValidated;
    }

    public function setProviderValidated(bool $providerValidated): static
    {
        $this->providerValidated = $providerValidated;

        return $this;
    }

    public function getSchedule(): ?Schedule
    {
        return $this->schedule;
    }

    public function setSchedule(Schedule $schedule): static
    {
        // set the owning side of the relation if necessary
        if ($schedule->getUserId() !== $this) {
            $schedule->setUserId($this);
        }

        $this->schedule = $schedule;

        return $this;
    }

    /**
     * @return Collection<int, Holiday>
     */
    public function getHolidays(): Collection
    {
        return $this->holidays;
    }

    public function addHoliday(Holiday $holiday): static
    {
        if (!$this->holidays->contains($holiday)) {
            $this->holidays->add($holiday);
            $holiday->setUserId($this);
        }

        return $this;
    }

    public function removeHoliday(Holiday $holiday): static
    {
        if ($this->holidays->removeElement($holiday)) {
            // set the owning side to null (unless already changed)
            if ($holiday->getUserId() === $this) {
                $holiday->setUserId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Appointment>
     */
    public function getAppointments(): Collection
    {
        return $this->appointments;
    }

    public function addAppointment(Appointment $appointment): static
    {
        if (!$this->appointments->contains($appointment)) {
            $this->appointments->add($appointment);
            $appointment->setClientId($this);
        }

        return $this;
    }

    public function removeAppointment(Appointment $appointment): static
    {
        if ($this->appointments->removeElement($appointment)) {
            // set the owning side to null (unless already changed)
            if ($appointment->getClientId() === $this) {
                $appointment->setClientId(null);
            }
        }

        return $this;
    }
}
