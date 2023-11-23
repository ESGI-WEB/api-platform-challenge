<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Enum\GroupsEnum;
use App\Repository\OrganisationRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(
            normalizationContext: ['groups' => [GroupsEnum::ORGANISATION_READ_DETAILED->value]]
        ),
    ],
)]
#[ORM\Entity(repositoryClass: OrganisationRepository::class)]
class Organisation
{
    #[Groups([GroupsEnum::ORGANISATION_READ_DETAILED->value])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::GUID)]
    private ?string $uuid = null;

    #[Groups([GroupsEnum::ORGANISATION_READ_DETAILED->value])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups([GroupsEnum::ORGANISATION_READ_DETAILED->value])]
    #[ORM\Column(type: Types::DECIMAL, precision: 20, scale: 16)]
    private ?string $latitude = null;

    #[Groups([GroupsEnum::ORGANISATION_READ_DETAILED->value])]
    #[ORM\Column(type: Types::DECIMAL, precision: 20, scale: 16)]
    private ?string $longitude = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'organisations')]
    private Collection $users;

    #[Groups([GroupsEnum::ORGANISATION_READ_DETAILED->value])]
    #[ORM\OneToMany(mappedBy: 'organisation', targetEntity: Service::class, orphanRemoval: true)]
    private Collection $services;

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'organisation', targetEntity: Schedule::class)]
    private Collection $schedules;

    #[ORM\OneToMany(mappedBy: 'organisation', targetEntity: Holiday::class)]
    private Collection $holidays;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->services = new ArrayCollection();
        $this->createdAt = new DateTimeImmutable();
        $this->schedules = new ArrayCollection();
        $this->holidays = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(string $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->users->removeElement($user);

        return $this;
    }

    /**
     * @return Collection<int, Service>
     */
    public function getServices(): Collection
    {
        return $this->services;
    }

    public function addService(Service $service): static
    {
        if (!$this->services->contains($service)) {
            $this->services->add($service);
            $service->setOrganisation($this);
        }

        return $this;
    }

    public function removeService(Service $service): static
    {
        if ($this->services->removeElement($service)) {
            // set the owning side to null (unless already changed)
            if ($service->getOrganisation() === $this) {
                $service->setOrganisation(null);
            }
        }

        return $this;
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
     * @return Collection<int, Schedule>
     */
    public function getSchedules(): Collection
    {
        return $this->schedules;
    }

    public function addSchedule(Schedule $schedule): static
    {
        if (!$this->schedules->contains($schedule)) {
            $this->schedules->add($schedule);
            $schedule->setOrganisation($this);
        }

        return $this;
    }

    public function removeSchedule(Schedule $schedule): static
    {
        if ($this->schedules->removeElement($schedule)) {
            // set the owning side to null (unless already changed)
            if ($schedule->getOrganisation() === $this) {
                $schedule->setOrganisation(null);
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
            $holiday->setOrganisation($this);
        }

        return $this;
    }

    public function removeHoliday(Holiday $holiday): static
    {
        if ($this->holidays->removeElement($holiday)) {
            // set the owning side to null (unless already changed)
            if ($holiday->getOrganisation() === $this) {
                $holiday->setOrganisation(null);
            }
        }

        return $this;
    }
}
