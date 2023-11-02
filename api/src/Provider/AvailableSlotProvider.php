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
use DateTime;
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

        // TODO : - securisation
        //        - being able to order one datetime (aka déplacer ce code ailleurs)

        $organisation_id = $uriVariables['organisation_id'];
        $startDate = new DateTime();
        $endDate = new DateTime('+2 weeks');
        $interval = DateInterval::createFromDateString('1 day');

        $schedules = $this->scheduleRepository->findBy(['organisation' => $organisation_id]);

        // get all holidays for all providers found in schedules
        $holidays = $this->holidayRepository->findByDateTimeBetween(
            $startDate,
            $endDate,
            ['provider' => array_unique(array_map(fn($schedule) => $schedule->getProvider()->getId(), $schedules))]
        );

        $nextTwoWeeksDays = new \DatePeriod(
            $startDate,
            $interval,
            $endDate
        );

        $allAvailableSlots = [];

        foreach ($nextTwoWeeksDays as $date) {
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
                        if ($holiday->getProvider()->getId() === $daySchedule->getProvider()->getId() &&
                            $slotDateTime->format('Y-m-d H:i') >= $holiday->getDatetimeStart()->format('Y-m-d H:i') &&
                            $slotDateTime->format('Y-m-d H:i') <= $holiday->getDatetimeEnd()->format('Y-m-d H:i')) {
                            continue 2; // stop if slot is in holiday
                        }
                    }

                    // check if there is already an available slot for this datetime
                    $slotsAtSameTime = null;
                    foreach ($allAvailableSlots as $availableSlot) {
                        if ($slotDateTime->getTimestamp() === $availableSlot->getDatetime()->getTimestamp()) {
                            $slotsAtSameTime = $availableSlot;
                            break;
                        }
                    }

                    if ($slotsAtSameTime !== null) {
                        $slotsAtSameTime->addProvider($daySchedule->getProvider());
                    } else {
                        $availableSlot = new AvailableSlot();
                        $availableSlot->setDatetime($slotDateTime);
                        $availableSlot->setOrganisationId($organisation_id);
                        $availableSlot->addProvider($daySchedule->getProvider());
                        $allAvailableSlots[] = $availableSlot;
                    }
                }
            }
        }

        usort($allAvailableSlots, fn($a, $b) => $a->getDatetime() <=> $b->getDatetime());

        return $allAvailableSlots;
    }
}