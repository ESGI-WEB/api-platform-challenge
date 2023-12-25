<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Enum\GroupsEnum;
use App\Provider\ServicesNamesProvider;
use App\Repository\ServiceRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;


#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
    ],
    normalizationContext: ['groups' => [GroupsEnum::SERVICE_READ->value]],
)]
#[ORM\Entity(repositoryClass: ServiceRepository::class)]
class Service
{
    #[Groups([GroupsEnum::SERVICE_READ->value, GroupsEnum::ORGANISATION_READ_DETAILED->value, GroupsEnum::APPOINTMENT_WRITE->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups([GroupsEnum::SERVICE_READ->value, GroupsEnum::ORGANISATION_READ_DETAILED->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[Groups([GroupsEnum::SERVICE_READ->value, GroupsEnum::ORGANISATION_READ_DETAILED->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[Groups([GroupsEnum::SERVICE_READ->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value])]
    #[ORM\ManyToOne(inversedBy: 'services')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Organisation $organisation = null;

    #[ORM\OneToMany(mappedBy: 'service', targetEntity: Feedback::class, orphanRemoval: true)]
    private Collection $feedback;

    #[ORM\OneToMany(mappedBy: 'service', targetEntity: Appointment::class, orphanRemoval: true)]
    private Collection $appointments;

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->feedback = new ArrayCollection();
        $this->appointments = new ArrayCollection();
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getOrganisation(): ?Organisation
    {
        return $this->organisation;
    }

    public function setOrganisation(?Organisation $organisation): static
    {
        $this->organisation = $organisation;

        return $this;
    }

    /**
     * @return Collection<int, Feedback>
     */
    public function getFeedback(): Collection
    {
        return $this->feedback;
    }

    public function addFeedback(Feedback $feedback): static
    {
        if (!$this->feedback->contains($feedback)) {
            $this->feedback->add($feedback);
            $feedback->setService($this);
        }

        return $this;
    }

    public function removeFeedback(Feedback $feedback): static
    {
        if ($this->feedback->removeElement($feedback)) {
            // set the owning side to null (unless already changed)
            if ($feedback->getService() === $this) {
                $feedback->setService(null);
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
            $appointment->setService($this);
        }

        return $this;
    }

    public function removeAppointment(Appointment $appointment): static
    {
        if ($this->appointments->removeElement($appointment)) {
            // set the owning side to null (unless already changed)
            if ($appointment->getService() === $this) {
                $appointment->setService(null);
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
}
