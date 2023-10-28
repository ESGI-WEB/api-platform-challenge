<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use App\Enum\GroupsEnum;
use App\Repository\HolidayRepository;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    uriTemplate: 'organisations/{organisation_id}/users/{provider_id}/holidays',
    operations: [
        new GetCollection(), // TODO to secure
        new Post(denormalizationContext: ['groups' => [GroupsEnum::HOLIDAY_WRITE->value]]) // todo faut etre provider et avoir le user dans son organisation
    ],
    uriVariables: [
        'organisation_id' => new Link(
            fromProperty: 'schedules',
            fromClass: Organisation::class,
        ),
        'provider_id' => new Link(
            fromProperty: 'holidays',
            fromClass: User::class
        ),
    ],
    normalizationContext: ['groups' => [GroupsEnum::HOLIDAY_READ->value]],
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
    private ?\DateTimeInterface $datetimeStart = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups([GroupsEnum::HOLIDAY_WRITE->value, GroupsEnum::HOLIDAY_READ->value])]
    private ?\DateTimeInterface $datetimeEnd = null;

    #[Groups([GroupsEnum::HOLIDAY_WRITE->value])]
    #[ORM\ManyToOne(inversedBy: 'holidays')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $provider = null;

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'holidays')]
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
