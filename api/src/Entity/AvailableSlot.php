<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Enum\GroupsEnum;
use App\Provider\AvailableSlotProvider;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    uriTemplate: '/organisation/{organisation_id}/available-slots',
    operations: [
        new GetCollection(),
    ],
    normalizationContext: ['groups' => [GroupsEnum::AVAILABLE_SLOT_READ->value]],
    provider: AvailableSlotProvider::class,
)]
class AvailableSlot
{
    #[Groups([GroupsEnum::AVAILABLE_SLOT_READ->value])]
    private DateTimeImmutable $datetime;

    #[Groups([GroupsEnum::AVAILABLE_SLOT_READ->value])]
    private int $provider_id;

    #[Groups([GroupsEnum::AVAILABLE_SLOT_READ->value])]
    private int $organisation_id;

    public function getDatetime(): DateTimeImmutable
    {
        return $this->datetime;
    }

    public function setDatetime(DateTimeImmutable $datetime): self
    {
        $this->datetime = $datetime;

        return $this;
    }

    public function getProviderId(): int
    {
        return $this->provider_id;
    }

    public function setProviderId(int $provider_id): self
    {
        $this->provider_id = $provider_id;

        return $this;
    }

    public function getOrganisationId(): int
    {
        return $this->organisation_id;
    }

    public function setOrganisationId(int $organisation_id): self
    {
        $this->organisation_id = $organisation_id;

        return $this;
    }
}
