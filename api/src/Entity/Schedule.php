<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use App\Enum\DaysEnum;
use App\Enum\GroupsEnum;
use App\Repository\ScheduleRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
// TODO ADD UNICITÉ
#[ApiResource(
    uriTemplate: '/organisations/{organisation_id}/users/{provider_id}/schedules',
    operations: [
        new GetCollection(), // TODO to secure
        new Post(denormalizationContext: ['groups' => [GroupsEnum::SCHEDULE_WRITE->value]]), // todo faut etre provider et avoir le user dans son organisation
    ],
    uriVariables: [
        'organisation_id' => new Link(
            fromProperty: 'schedules',
            fromClass: Organisation::class,
        ),
        'provider_id' => new Link(
            fromProperty: 'schedules',
            fromClass: User::class,
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::SCHEDULE_READ->value]],
)]
#[ORM\Entity(repositoryClass: ScheduleRepository::class)]
class Schedule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([GroupsEnum::SCHEDULE_READ->value])]
    private ?int $id = null;

    #[Groups([GroupsEnum::SCHEDULE_WRITE->value, GroupsEnum::SCHEDULE_READ->value])]
    #[ORM\Column(length: 10)]
    #[Assert\Choice(callback: [DaysEnum::class, 'values'])]
    private ?string $day = null;

    #[Groups([GroupsEnum::SCHEDULE_WRITE->value, GroupsEnum::SCHEDULE_READ->value])]
    #[ORM\Column]
    private array $hours = [];

    #[Groups([GroupsEnum::SCHEDULE_WRITE->value, GroupsEnum::SCHEDULE_READ->value])]
    #[ORM\ManyToOne(inversedBy: 'schedules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $provider = null;

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'schedules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Organisation $organisation = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDay(): ?string
    {
        return $this->day;
    }

    public function setDay(string $day): static
    {
        $this->day = $day;

        return $this;
    }

    public function getHours(): array
    {
        return $this->hours;
    }

    public function setHours(array $hours): static
    {
        $this->hours = $hours;

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

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
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
}
