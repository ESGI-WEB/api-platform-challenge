<?php

namespace App\Provider;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\AvailableSlot;
use App\Enum\DaysEnum;
use App\Repository\HolidayRepository;
use App\Repository\ScheduleRepository;
use DateInterval;
use DateTimeImmutable;

readonly class AvailableSlotProvider implements ProviderInterface
{
    public function __construct(
        private ScheduleRepository $scheduleRepository,
        private HolidayRepository $holidayRepository,
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
        // todo add organisation_id to schedule & holiday entities
        // todo get only available slots for this organisation_id

        $organisation_id = $uriVariables['organisation_id'];
        $endDate = new \DateTime('+2 weeks');
        $interval = DateInterval::createFromDateString('1 day');

        $schedules = $this->scheduleRepository->findBy(['organisation' => $organisation_id]);

        // get holidays for next two weeks (start_date before now + 2 weeks)
        $holidays = $this->holidayRepository->getNextHolidaysBefore(
            $endDate,
            ['organisation' => $organisation_id]
        );

        $nextTwoWeeks = new \DatePeriod(
            new \DateTime(),
            $interval,
            $endDate
        );

        $allAvailableSlots = [];

        foreach ($nextTwoWeeks as $date) {
            $currentDay = DaysEnum::from(strtolower($date->format('l')));
            $daySchedules = array_filter(
                $schedules,
                fn($schedule) => $schedule->getDay() === $currentDay->value
            );

            foreach ($daySchedules as $daySchedule) {
                // add only available hours depending on holidays
                foreach ($daySchedule->getHours() as $hour) {
                    $slotDateTime = new DateTimeImmutable($date->format('Y-m-d') . ' ' . $hour);

                    foreach ($holidays as $holiday) {
                        // todo il faut ajouter un delai, 30 min ou prochaine schedule ?
                        if ($slotDateTime->format('Y-m-d HH:i') >= $holiday->getDatetimeStart()->format('Y-m-d HH:i') &&
                            $slotDateTime->format('Y-m-d HH:i') <= $holiday->getDatetimeEnd()->format('Y-m-d HH:i')) {
                            continue 2; // stop if slot is in holiday
                        }
                    }

                    $availableSlots = new AvailableSlot();
                    $availableSlots->setDatetime($slotDateTime);
                    $availableSlots->setProviderId($daySchedule->getProvider()->getId());
                    $availableSlots->setOrganisationId($organisation_id);
                    $allAvailableSlots[] = $availableSlots;
                }
            }
        }

        return $allAvailableSlots;
    }
}