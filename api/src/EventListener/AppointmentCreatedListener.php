<?php

namespace App\EventListener;

use App\Entity\Appointment;
use App\Services\SmsService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, entity: Appointment::class)]
class AppointmentCreatedListener
{
    public function __construct(
        private readonly SmsService $smsService,
    ) { }

    public function postPersist(Appointment $appointment, PostPersistEventArgs $event): void
    {
        $this->smsService->sendNewAppointmentNotification($appointment);
    }
}