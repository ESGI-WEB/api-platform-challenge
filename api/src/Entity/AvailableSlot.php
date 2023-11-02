<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Enum\GroupsEnum;
use App\Provider\AvailableSlotProvider;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
    private Collection $providers;

    private int $organisation_id;


    public function __construct()
    {
        $this->providers = new ArrayCollection();
    }

    public function getDatetime(): DateTimeImmutable
    {
        return $this->datetime;
    }

    public function setDatetime(DateTimeImmutable $datetime): self
    {
        $this->datetime = $datetime;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getProviders(): Collection
    {
        return $this->providers;
    }

    public function addProvider(User $provider): self
    {
        if (!$this->providers->contains($provider)) {
            $this->providers[] = $provider;
        }

        return $this;
    }

    public function removeProvider(User $provider): self
    {
        $this->providers->removeElement($provider);

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
