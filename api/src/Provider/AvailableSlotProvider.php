<?php

namespace App\Provider;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\AvailableSlot;
use App\Enum\DaysEnum;
use App\Repository\AppointmentRepository;
use App\Repository\HolidayRepository;
use App\Repository\ScheduleRepository;
use App\Services\SlotsService;
use DateInterval;
use DateTime;
use DateTimeImmutable;

readonly class AvailableSlotProvider implements ProviderInterface
{
    public function __construct(
        private SlotsService $slotsService,
    ) {
    }

    /**
     * @throws \Exception
     */
    public function provide(
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): object|array|null {
        if (!$operation instanceof CollectionOperationInterface) {
            return null;
        }
        return $this->slotsService->getAvailableSlots($uriVariables['organisation_id']);
    }
}