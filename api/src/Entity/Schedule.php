<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\DaysEnum;
use App\Enum\GroupsEnum;
use App\Repository\ScheduleRepository;
use App\Security\Voter\ScheduleHolidayVoter;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    uriTemplate: '/organisations/{organisation_id}/schedules',
    operations: [
        new GetCollection(security: "is_granted('" . ScheduleHolidayVoter::VIEW_FOR_ORGANISATION . "', object)"),
    ],
    uriVariables: [
        'organisation_id' => new Link(
            toProperty: 'organisation',
            fromClass: Organisation::class,
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::SCHEDULE_READ->value]],
)]
#[ApiResource(
    uriTemplate: '/users/{user_id}/schedules',
    operations: [
        new GetCollection(security: "is_granted('" . ScheduleHolidayVoter::VIEW_FOR_USER . "', object)"),
    ],
    uriVariables: [
        'user_id' => new Link(
            toProperty: 'provider',
            fromClass: User::class,
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::SCHEDULE_READ->value]],
    paginationEnabled: false,
)]
#[ApiResource(
    operations: [
        new Patch(
            denormalizationContext: ['groups' => [GroupsEnum::SCHEDULE_WRITE->value]],
            securityPostDenormalize: "is_granted('" . ScheduleHolidayVoter::EDIT . "', object)"
        ),
        new Post(
            denormalizationContext: ['groups' => [GroupsEnum::SCHEDULE_WRITE->value]],
            securityPostDenormalize: "is_granted('" . ScheduleHolidayVoter::CREATE . "', object)"
        ),
        new Delete(
            securityPostDenormalize: "is_granted('" . ScheduleHolidayVoter::DELETE . "', object)"
        ),
    ]
)]
#[UniqueEntity(fields: ['day', 'provider', 'organisation'])]
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
    #[Assert\NotBlank]
    #[Assert\Choice(callback: [DaysEnum::class, 'values'])]
    private ?string $day = null;

    #[Groups([GroupsEnum::SCHEDULE_WRITE->value, GroupsEnum::SCHEDULE_READ->value])]
    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\All(constraints: [
        new Assert\NotBlank(),
        new Assert\Regex(pattern: '/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/') // match 00:00 to 23:59
    ])]
    private array $hours = [];

    #[Groups([GroupsEnum::SCHEDULE_WRITE->value, GroupsEnum::SCHEDULE_READ->value])]
    #[Assert\NotBlank]
    #[ORM\ManyToOne(inversedBy: 'schedules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $provider = null;

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'schedules')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([GroupsEnum::SCHEDULE_READ_DETAILED->value, GroupsEnum::SCHEDULE_WRITE->value])]
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
