<?php

namespace App\Controller;

use App\Entity\Appointment;
use App\Entity\Organisation;
use App\Enum\RolesEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class StatisticsController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    #[Route('/appointments_count', name: 'appointments_count', methods: ['GET'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function getAppointmentCount(): JsonResponse
    {
        $user = $this->security->getUser();

        if ($user === null) {
            return $this->json(['count' => null]);
        }

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            $appointmentCount = $this->entityManager
                ->getRepository(Appointment::class)
                ->createQueryBuilder('appointment')
                ->select('COUNT(appointment.id)')
                ->getQuery()
                ->getSingleScalarResult();
        } else {
            $appointmentCount = count($user->getClientAppointments());
        }

        return $this->json(['count' => $appointmentCount]);
    }

    #[Route('/max_appointment_slot', name: 'max_appointment_slot', methods: ['GET'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function maxAppointmentSlot(): JsonResponse
    {
        $user = $this->security->getUser();

        if ($user === null) {
            return $this->json(['slot' => null]);
        }

        $qb = $this->entityManager
            ->getRepository(Appointment::class)
            ->createQueryBuilder('appointment')
            ->select("date_format(appointment.datetime, 'HH:mm') AS appointment_time")
            ->groupBy('appointment_time')
            ->orderBy('COUNT(appointment.id)', 'DESC')
            ->setMaxResults(1);

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            $qb->andWhere('appointment.provider = :user')
                ->setParameter('user', $user);
        }

        $result = $qb->getQuery()->getSingleResult();

        return $this->json(['time' => $result['appointment_time']]);
    }

    #[Route('/last_appointments', name: 'last_appointments', methods: ['GET'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function last_appointments(): JsonResponse
    {
        $user = $this->security->getUser();

        if ($user === null) {
            return $this->json(null);
        }

        $today = new \DateTime();
        $startOfDay = new \DateTime($today->format('Y-m-d 00:00:00'));
        $endOfDay = new \DateTime($today->format('Y-m-d 23:59:59'));

        $qb = $this->entityManager
            ->getRepository(Appointment::class)
            ->createQueryBuilder('appointment')
            ->innerJoin('appointment.client', 'client')
            ->innerJoin('appointment.service', 'service')
            ->innerJoin('service.organisation', 'organisation')
            ->where('appointment.createdAt BETWEEN :startOfDay AND :endOfDay')
            ->setParameter('startOfDay', $startOfDay)
            ->setParameter('endOfDay', $endOfDay)
            ->orderBy('appointment.createdAt', 'DESC')
            ->setMaxResults(5);

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            $qb->andWhere('appointment.provider = :user')
                ->setParameter('user', $user);
        }

        $result = $qb
            ->select([
                'appointment.datetime as subtitle',
                "CONCAT(client.lastname, ' ', client.firstname) AS title",
                'organisation.name as description',
                "CONCAT(organisation.address, ' ', organisation.zipcode, ' ', organisation.city) AS subdescription",
            ])
            ->getQuery()
            ->getResult();

        return $this->json($result);
    }

    #[Route('/max_organisations', name: 'max_organisations', methods: ['GET'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function max_organisation(): JsonResponse
    {
        $user = $this->security->getUser();

        if ($user === null) {
            return $this->json(null);
        }

        $today = new \DateTime();
        $startOfMonth = new \DateTime($today->format('Y-m-01 00:00:00'));
        $endOfMonth = new \DateTime($today->format('Y-m-t 23:59:59'));

        $qb = $this->entityManager
            ->getRepository(Organisation::class)
            ->createQueryBuilder('organisation')
            ->innerJoin('organisation.services', 'services')
            ->innerJoin('services.appointments', 'appointments')
            ->where('appointments.createdAt BETWEEN :startOfMonth AND :endOfMonth')
            ->setParameter('startOfMonth', $startOfMonth)
            ->setParameter('endOfMonth', $endOfMonth);

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            $qb->andWhere('appointments.provider = :user')
                ->setParameter('user', $user);
        }

        $result = $qb
            ->select([
                'organisation.name as subtitle',
                "COUNT(appointments.id) AS title",
                'organisation.address as description',
                "CONCAT(organisation.zipcode, ' ', organisation.city) AS subdescription",
            ])
            ->groupBy('organisation.id')
            ->orderBy('title', 'DESC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();

        return $this->json($result);
    }

}