<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\GroupsEnum;
use App\Enum\RolesEnum;
use App\Provider\EmployeesProvider;
use App\Provider\ProviderToValidateProvider;
use App\Repository\UserRepository;
use App\Security\Voter\UserVoter;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ApiResource(
    operations: [
        new Get(
            normalizationContext: ['groups' => [
                GroupsEnum::USER_READ->value,
                GroupsEnum::USER_READ_DETAILED->value,
                GroupsEnum::HOLIDAY_READ->value,
                GroupsEnum::HOLIDAY_READ_DETAILED->value,
                GroupsEnum::SCHEDULE_READ->value,
                GroupsEnum::SCHEDULE_READ_DETAILED->value,
                GroupsEnum::ORGANISATION_READ->value
            ]],
            security: "is_granted('" . UserVoter::VIEW . "', object)",

        ),
        new GetCollection(security: "is_granted('" . RolesEnum::ADMIN->value . "')"),
        new Post(
            denormalizationContext: ['groups' => [GroupsEnum::USER_WRITE->value, GroupsEnum::USER_CREATE->value]],
            validationContext: ['groups' => [GroupsEnum::USER_CREATE->value]],
        ),
        new Post(
            uriTemplate: "/users/provider",
            inputFormats: ['multipart' => ['multipart/form-data']],
            denormalizationContext: ['groups' => [GroupsEnum::USER_WRITE->value, GroupsEnum::USER_CREATE->value, GroupsEnum::USER_CREATE_PROVIDER->value]]
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
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: "/users/{id}/employees",
            provider: EmployeesProvider::class,
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::USER_READ->value]],
    security: "is_granted('" . RolesEnum::PROVIDER->value . "')",
)]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: "/providers_to_validate",
            normalizationContext: ['groups' => [GroupsEnum::USER_READ->value]],
            security: "is_granted('" . RolesEnum::ADMIN->value . "')",
            provider: ProviderToValidateProvider::class
        ),
    ],
)]
#[UniqueEntity(fields: ['email'])]
#[ORM\Table(name: '`user`')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups([GroupsEnum::USER_READ->value, GroupsEnum::TEAMS_READ_USER_DETAILED->value, GroupsEnum::ORGANISATION_READ_DETAILED_LOGGED->value, GroupsEnum::AVAILABLE_SLOT_READ->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value, GroupsEnum::ORGANISATION_READ_DETAILED->value, GroupsEnum::ANSWER_READ_DETAILED->value])]
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[Groups([GroupsEnum::USER_READ->value, GroupsEnum::USER_WRITE_ADMIN->value])]
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    // password must be 8 caracteres long, with 1 number, 1 uppercase, 1 lowercase, 1 special character
    #[Assert\Regex(pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/')]
    #[Assert\NotBlank(groups: [GroupsEnum::USER_CREATE->value])] // set by UserDenormalizer
    private string $password = '';

    #[Groups([GroupsEnum::USER_WRITE->value, GroupsEnum::USER_CREATE->value])]
    private ?string $plainPassword = null;

    #[Groups([GroupsEnum::USER_READ->value, GroupsEnum::TEAMS_READ_USER_DETAILED->value, GroupsEnum::USER_WRITE->value, GroupsEnum::ORGANISATION_READ_DETAILED_LOGGED->value])]
    #[Assert\Email]
    #[Assert\NotBlank]
    #[ORM\Column(length: 180, unique: true)]
    private string $email = '';

    #[Groups([GroupsEnum::USER_READ->value])]
    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[Groups([GroupsEnum::USER_READ->value, GroupsEnum::TEAMS_READ_USER_DETAILED->value, GroupsEnum::USER_WRITE->value, GroupsEnum::AVAILABLE_SLOT_READ->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value, GroupsEnum::ORGANISATION_READ_DETAILED_LOGGED->value, GroupsEnum::ANSWER_READ_DETAILED->value])]
    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[Groups([GroupsEnum::USER_READ->value, GroupsEnum::TEAMS_READ_USER_DETAILED->value, GroupsEnum::USER_WRITE->value, GroupsEnum::AVAILABLE_SLOT_READ->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value, GroupsEnum::ORGANISATION_READ_DETAILED_LOGGED->value, GroupsEnum::ANSWER_READ_DETAILED->value])]
    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[Groups([GroupsEnum::USER_READ_DETAILED->value])]
    #[ORM\OneToMany(mappedBy: 'provider', targetEntity: Schedule::class, orphanRemoval: true)]
    private Collection $schedules;

    #[Groups([GroupsEnum::USER_READ_DETAILED->value])]
    #[ORM\OneToMany(mappedBy: 'provider', targetEntity: Holiday::class, orphanRemoval: true)]
    private Collection $holidays;

    #[Groups([GroupsEnum::USER_READ_DETAILED->value])]
    #[ORM\ManyToMany(targetEntity: Organisation::class, mappedBy: 'users')]
    private Collection $organisations;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Appointment::class, orphanRemoval: true)]
    private Collection $clientAppointments;

    #[ORM\OneToMany(mappedBy: 'provider', targetEntity: Appointment::class, orphanRemoval: true)]
    private Collection $providerAppointments;

    #[Groups([GroupsEnum::USER_READ->value])]
    private int $countOrganisations = 0;

    #[ApiProperty(
        openapiContext: [
            'type' => 'string',
            'format' => 'binary',
            'example' => 'data:application/pdf;base64, ...'
        ],
        types: ['file']
    )]
    #[Vich\UploadableField(mapping: 'kbis', fileNameProperty: 'filePath')]
    #[Assert\File(maxSize: '2048k', mimeTypes: ['application/pdf'])]
    #[Groups([GroupsEnum::USER_CREATE_PROVIDER->value, GroupsEnum::USER_READ->value])]
    public ?File $file = null;

    #[ORM\Column(nullable: true)]
    public ?string $filePath = null;

    #[Groups([GroupsEnum::USER_CREATE->value])]
    public bool $registerAsEmployee = false;

    #[ApiProperty(types: ['https://schema.org/contentUrl'])]
    #[Groups([GroupsEnum::USER_READ->value])]
    public ?string $contentUrl = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups([GroupsEnum::USER_CREATE->value, GroupsEnum::USER_READ->value, GroupsEnum::USER_WRITE->value])]
    #[Assert\Regex(
        pattern: '/^\+33[0-9]{9}$/',
        groups: [GroupsEnum::USER_CREATE->value, GroupsEnum::USER_CREATE_PROVIDER->value, GroupsEnum::USER_WRITE->value]
    )]
    private ?string $phone = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->schedules = new ArrayCollection();
        $this->holidays = new ArrayCollection();
        $this->organisations = new ArrayCollection();
        $this->clientAppointments = new ArrayCollection();
        $this->providerAppointments = new ArrayCollection();
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

        if (in_array(RolesEnum::ADMIN->value, $roles)) {
            $roles[] = RolesEnum::PROVIDER->value;
            $roles[] = RolesEnum::EMPLOYEE->value;
        } else if (in_array(RolesEnum::PROVIDER->value, $roles)) {
            $roles[] = RolesEnum::EMPLOYEE->value;
        }

        $roles = array_map(function ($role) {
            return $role instanceof RolesEnum ? $role->value : $role;
        }, $roles);

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

    /**
     * @return Collection<int, Schedule>
     */
    public function getSchedules(): Collection
    {
        return $this->schedules;
    }

    public function setRegisterAsEmployee(bool $registerAsEmployee): static
    {
        $this->registerAsEmployee = $registerAsEmployee;
        return $this;
    }

    public function getRegisterAsEmployee(): ?string
    {
        return $this->registerAsEmployee;
    }

    public function addSchedule(Schedule $schedule): static
    {
        if (!$this->schedules->contains($schedule)) {
            $this->schedules->add($schedule);
            $schedule->setProvider($this);
        }

        return $this;
    }

    public function removeSchedule(Schedule $schedule): static
    {
        if ($this->schedules->removeElement($schedule)) {
            // set the owning side to null (unless already changed)
            if ($schedule->getProvider() === $this) {
                $schedule->setProvider(null);
            }
        }

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
            $holiday->setProvider($this);
        }

        return $this;
    }

    public function removeHoliday(Holiday $holiday): static
    {
        if ($this->holidays->removeElement($holiday)) {
            // set the owning side to null (unless already changed)
            if ($holiday->getProvider() === $this) {
                $holiday->setProvider(null);
            }
        }

        return $this;
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
            $organisation->addUser($this);
        }

        return $this;
    }

    public function removeOrganisation(Organisation $organisation): static
    {
        if ($this->organisations->removeElement($organisation)) {
            $organisation->removeUser($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Appointment>
     */
    public function getClientAppointments(): Collection
    {
        return $this->clientAppointments;
    }

    public function addClientAppointment(Appointment $clientAppointment): static
    {
        if (!$this->clientAppointments->contains($clientAppointment)) {
            $this->clientAppointments->add($clientAppointment);
            $clientAppointment->setClient($this);
        }

        return $this;
    }

    public function removeClientAppointment(Appointment $clientAppointment): static
    {
        if ($this->clientAppointments->removeElement($clientAppointment)) {
            // set the owning side to null (unless already changed)
            if ($clientAppointment->getClient() === $this) {
                $clientAppointment->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Appointment>
     */
    public function getProviderAppointments(): Collection
    {
        return $this->providerAppointments;
    }

    public function addProviderAppointment(Appointment $providerAppointment): static
    {
        if (!$this->providerAppointments->contains($providerAppointment)) {
            $this->providerAppointments->add($providerAppointment);
            $providerAppointment->setProvider($this);
        }

        return $this;
    }

    public function removeProviderAppointment(Appointment $providerAppointment): static
    {
        if ($this->providerAppointments->removeElement($providerAppointment)) {
            // set the owning side to null (unless already changed)
            if ($providerAppointment->getProvider() === $this) {
                $providerAppointment->setProvider(null);
            }
        }

        return $this;
    }

    public function getCountOrganisations(): int
    {
        return $this->organisations->count();
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }
}
