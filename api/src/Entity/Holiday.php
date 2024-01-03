<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\GroupsEnum;
use App\Repository\HolidayRepository;
use App\Security\Voter\ScheduleHolidayVoter;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    uriTemplate: '/organisations/{organisation_id}/holidays',
    operations: [
        new GetCollection(security: "is_granted('" . ScheduleHolidayVoter::VIEW_FOR_ORGANISATION . "', object)"),
    ],
    uriVariables: [
        'organisation_id' => new Link(
            toProperty: 'organisation',
            fromClass: Organisation::class,
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::HOLIDAY_READ->value]],
)]
#[ApiResource(
    uriTemplate: '/users/{user_id}/holidays',
    operations: [
        new GetCollection(security: "is_granted('" . ScheduleHolidayVoter::VIEW_FOR_USER . "', object)"),
    ],
    uriVariables: [
        'user_id' => new Link(
            toProperty: 'provider',
            fromClass: User::class,
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::HOLIDAY_READ->value]],
    paginationEnabled: false,
)]
#[ApiResource(
    operations: [
        new Post(
            denormalizationContext: ['groups' => [GroupsEnum::HOLIDAY_WRITE->value]],
            securityPostDenormalize: "is_granted('" . ScheduleHolidayVoter::CREATE . "', object)"
        ),
        new Delete(
            security: "is_granted('" . ScheduleHolidayVoter::DELETE . "', object)"
        ),
    ]
)]
#[ORM\Entity(repositoryClass: HolidayRepository::class)]
class Holiday
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([GroupsEnum::HOLIDAY_READ->value])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups([GroupsEnum::HOLIDAY_WRITE->value, GroupsEnum::HOLIDAY_READ->value])]
    #[Assert\NotBlank]
    private ?\DateTimeInterface $datetimeStart = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Assert\Expression(
        expression: "this.getDatetimeEnd() > this.getDatetimeStart()",
        message: "End date must be after the start date."
    )]
    #[Groups([GroupsEnum::HOLIDAY_WRITE->value, GroupsEnum::HOLIDAY_READ->value])]
    private ?\DateTimeInterface $datetimeEnd = null;

    #[Groups([GroupsEnum::HOLIDAY_WRITE->value])]
    #[Assert\NotBlank]
    #[ORM\ManyToOne(inversedBy: 'holidays')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $provider = null;

    #[ORM\Column]
    #[Groups([GroupsEnum::HOLIDAY_READ->value])]
    private DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'holidays')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([GroupsEnum::HOLIDAY_READ_DETAILED->value, GroupsEnum::HOLIDAY_WRITE->value])]
    #[Assert\NotNull]
    private ?Organisation $organisation = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDatetimeStart(): ?\DateTimeInterface
    {
        return $this->datetimeStart;
    }

    public function setDatetimeStart(\DateTimeInterface $datetimeStart): static
    {
        $this->datetimeStart = $datetimeStart;

        return $this;
    }

    public function getDatetimeEnd(): ?\DateTimeInterface
    {
        return $this->datetimeEnd;
    }

    public function setDatetimeEnd(\DateTimeInterface $datetimeEnd): static
    {
        $this->datetimeEnd = $datetimeEnd;

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
