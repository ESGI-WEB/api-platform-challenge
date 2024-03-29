<?php

namespace App\Services;

use App\Entity\AvailableSlot;
use App\Entity\User;
use App\Enum\AppointmentStatusEnum;
use App\Enum\DaysEnum;
use App\Repository\AppointmentRepository;
use App\Repository\HolidayRepository;
use App\Repository\ScheduleRepository;
use DateInterval;
use DateTime;
use DateTimeImmutable;
use Symfony\Bundle\SecurityBundle\Security;

readonly class SlotsService
{
    public function __construct(
        private ScheduleRepository $scheduleRepository,
        private HolidayRepository $holidayRepository,
        private AppointmentRepository $appointmentRepository,
        private Security $security,
    ) {
    }

    /**
     * @throws \Exception
     */
    public function getAvailableSlots(int $organisation_id, DateTime $targetDateTime = null, int $providerId = null): array
    {
        $startDate = new DateTime();
        $endDate = (new DateTime('+2 weeks'))->setTime(23, 59);

        if ($targetDateTime !== null) {
            $startDate = (clone $targetDateTime)->setTime(0, 0);
            $endDate = (clone $targetDateTime)->setTime(23, 59);
        }

        $interval = DateInterval::createFromDateString('1 day');

        $schedulesDataCriteria = ['organisation' => $organisation_id];
        if ($providerId !== null) {
            $schedulesDataCriteria['provider'] = $providerId;
        }
        $schedules = $this->scheduleRepository->findBy($schedulesDataCriteria);

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

        $nextTwoWeeksAppointments = $this->appointmentRepository->findByDateTimeBetween(
            $startDate,
            $endDate,
            ['status' => AppointmentStatusEnum::valid->value],
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
                    // if date is today, take only future hours
                    if ($date->diff(new DateTime())->days === 0) {
                        $hourDateTime = new DateTimeImmutable($date->format('Y-m-d') . ' ' . $hour);
                        if ($hourDateTime->getTimestamp() < (new DateTime())->getTimestamp()) {
                            continue;
                        }
                    }


                    $slotDateTime = new DateTimeImmutable($date->format('Y-m-d') . ' ' . $hour);

                    // if we are looking for a specific datetime, stop if it's not the right one
                    if ($targetDateTime !== null && $slotDateTime->getTimestamp() !== $targetDateTime->getTimestamp()) {
                        continue;
                    }

                    if (!$this->isSlotAvailable($slotDateTime, $daySchedule, $nextTwoWeeksAppointments)) {
                        continue; // stop if slot is already reserved
                    }

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

                    // if we are looking for a specific datetime and we found it, return it or null
                    if ($targetDateTime !== null && $slotDateTime->getTimestamp() === $targetDateTime->getTimestamp()) {
                        return $allAvailableSlots;
                    }
                }
            }
        }

        usort($allAvailableSlots, fn($a, $b) => $a->getDatetime() <=> $b->getDatetime());

        return $allAvailableSlots;
    }

    public function isSlotAvailable($slotDateTime, $daySchedule, array $nextTwoWeeksAppointments): bool
    {
        // check if there is an appointment at this time for this
        $isSlotAvailable = true;
        if (count($nextTwoWeeksAppointments)) {
            foreach ($nextTwoWeeksAppointments as $appointment) {
                $isSameProvider = $appointment->getProvider()->getId() === $daySchedule->getProvider()->getId();
                $isSameClient = $this->security->getUser() instanceof User &&
                    $appointment->getClient()->getId() === $this->security->getUser()->getId();

                if ($appointment->getDatetime()->getTimestamp() === $slotDateTime->getTimestamp() &&
                    ($isSameProvider || $isSameClient)) {
                    $isSlotAvailable = false;
                    break;
                }
            }
        }

        return $isSlotAvailable;
    }
}
