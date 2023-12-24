<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Common\Filter\SearchFilterInterface;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\AppointmentStatusEnum;
use App\Enum\GroupsEnum;
use App\Enum\RolesEnum;
use App\Provider\AppointmentListProvider;
use App\Repository\AppointmentRepository;
use App\Security\Voter\AppointmentVoter;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(security: 'is_granted("' . RolesEnum::ADMIN->value . '")'),
        new Post(
            normalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_READ->value]],
            denormalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_WRITE->value]],
            securityPostDenormalize: 'is_granted("' . AppointmentVoter::CREATE . '", object)',
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_READ->value]],
)]
#[ApiResource(
    uriTemplate: '/users/{user_id}/client_appointments',
    operations: [
        new GetCollection(
            openapiContext: [
                'summary' => 'Get all appointments where user is a client',
            ],
            normalizationContext: [
                'groups' => [
                    GroupsEnum::APPOINTMENT_READ->value,
                    GroupsEnum::APPOINTMENT_READ_DETAILED->value
                ]
            ],
            security: 'is_granted("' . AppointmentVoter::CLIENT_READ_COLLECTION . '", object)',
        ),
    ],
    uriVariables: [
        'user_id' => new Link(
            toProperty: 'client',
            fromClass: User::class
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_READ->value]],
)]
#[ApiResource(
    uriTemplate: '/users/{user_id}/client_appointments/{appointment_id}',
    operations: [
        new Get(
            openapiContext: [
                'summary' => 'Get an appointment where user is a client',
            ],
            normalizationContext: [
                'groups' => [
                    GroupsEnum::APPOINTMENT_READ->value,
                    GroupsEnum::APPOINTMENT_READ_DETAILED->value
                ]
            ],
            security: 'is_granted("' . AppointmentVoter::CLIENT_READ . '", object)',
        ),
        new Patch(
            openapiContext: [
                'summary' => 'Update an appointment where user is a client',
            ],
            normalizationContext: [
                'groups' => [
                    GroupsEnum::APPOINTMENT_READ->value,
                    GroupsEnum::APPOINTMENT_READ_DETAILED->value
                ]
            ],
            security: 'is_granted("' . AppointmentVoter::CLIENT_UPDATE . '", object)',
        ),
    ],
    uriVariables: [
        'user_id' => new Link(
            toProperty: 'client',
            fromClass: User::class
        ),
        'appointment_id' => new Link(
            fromClass: Appointment::class
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_READ->value]],
)]
#[ApiResource(
    uriTemplate: '/users/{provider_id}/employee_appointments',
    operations: [
        new GetCollection(
            openapiContext: [
                'summary' => 'Get all appointments where user is a provider',
            ],
            normalizationContext: [
                'groups' => [
                    GroupsEnum::APPOINTMENT_READ->value,
                    GroupsEnum::APPOINTMENT_READ_DETAILED->value
                ]
            ],
            security: 'is_granted("' . AppointmentVoter::EMPLOYEE_READ_COLLECTION . '", object)',
        ),
    ],
    uriVariables: [
        'provider_id' => new Link(
            toProperty: 'provider',
            fromClass: User::class
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_READ->value]],
)]
#[ApiResource(
    uriTemplate: '/users/{provider_id}/employee_appointments/{appointment_id}',
    operations: [
        new Get(
            openapiContext: [
                'summary' => 'Get an appointment where user is a provider',
            ],
            security: 'is_granted("' . AppointmentVoter::EMPLOYEE_READ . '", object)',
        ),
    ],
    uriVariables: [
        'provider_id' => new Link(
            toProperty: 'provider',
            fromClass: User::class
        ),
        'appointment_id' => new Link(
            fromClass: Appointment::class
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_READ->value]],
)]
#[ApiResource(
    uriTemplate: '/appointments/organisation/{id}',
    operations: [
        new GetCollection(
            openapiContext: [
                'summary' => 'Get appointments as a superintendent for an organisation',
            ],
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::APPOINTMENT_READ->value, GroupsEnum::APPOINTMENT_READ_DETAILED->value]],
    provider: AppointmentListProvider::class,
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'datetime'])]
#[ApiFilter(SearchFilter::class, properties: ['status' => SearchFilterInterface::STRATEGY_EXACT])]
#[ApiFilter(DateFilter::class, properties: ['datetime'])]
#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
class Appointment
{
    #[Groups([GroupsEnum::APPOINTMENT_READ->value])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups([GroupsEnum::APPOINTMENT_WRITE->value, GroupsEnum::APPOINTMENT_READ->value])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'clientAppointments')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $client = null;

    #[Groups([GroupsEnum::APPOINTMENT_WRITE->value, GroupsEnum::APPOINTMENT_READ->value])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'providerAppointments')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $provider = null;

    #[Groups([GroupsEnum::APPOINTMENT_WRITE->value, GroupsEnum::APPOINTMENT_READ->value])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(inversedBy: 'appointments')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Service $service = null;

    #[Groups([GroupsEnum::APPOINTMENT_WRITE->value, GroupsEnum::APPOINTMENT_READ->value])]
    #[Assert\NotNull]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $datetime = null;

    #[Groups([GroupsEnum::APPOINTMENT_WRITE->value])]
    #[ORM\OneToMany(mappedBy: 'appointment', targetEntity: Answer::class, orphanRemoval: true)]
    private Collection $answers;

    #[Groups([GroupsEnum::APPOINTMENT_READ->value])]
    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[Groups([GroupsEnum::APPOINTMENT_READ->value])]
    #[ORM\Column(length: 20, options: ['default' => AppointmentStatusEnum::valid->value])]
    #[Assert\Choice(callback: [AppointmentStatusEnum::class, 'values'])]
    #[Choice(callback: [AppointmentStatusEnum::class, 'values'])]
    private ?string $status = null;

    public function __construct()
    {
        $this->answers = new ArrayCollection();
        $this->createdAt = new DateTimeImmutable();
        $this->status = AppointmentStatusEnum::valid->value;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClient(): ?User
    {
        return $this->client;
    }

    public function setClient(?User $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getProvider(): ?User
    {
        return $this->provider;
    }

    public function setProvider(?User $provider): static
    {
        $this->provider = $provider;

        return $this;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): static
    {
        $this->service = $service;

        return $this;
    }

    public function getDatetime(): ?\DateTimeInterface
    {
        return $this->datetime;
    }

    public function setDatetime(\DateTimeInterface $datetime): static
    {
        $this->datetime = $datetime;

        return $this;
    }

    /**
     * @return Collection<int, Answer>
     */
    public function getAnswers(): Collection
    {
        return $this->answers;
    }

    public function addAnswer(Answer $answer): static
    {
        if (!$this->answers->contains($answer)) {
            $this->answers->add($answer);
            $answer->setAppointment($this);
        }

        return $this;
    }

    public function removeAnswer(Answer $answer): static
    {
        if ($this->answers->removeElement($answer)) {
            // set the owning side to null (unless already changed)
            if ($answer->getAppointment() === $this) {
                $answer->setAppointment(null);
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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }
}
