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
use Symfony\Contracts\Service\Attribute\Required;

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

        if (!$user) {
            return $this->json(['count' => null]);
        }

        $appointmentCount = $this->security->isGranted(RolesEnum::ADMIN->value)
            ? count($user->getClientAppointments())
            : $this->entityManager
                ->getRepository(Appointment::class)
                ->createQueryBuilder('appointment')
                ->select('COUNT(appointment.id)')
                ->getQuery()
                ->getSingleScalarResult();

        return $this->json(['count' => $appointmentCount]);
    }

    #[Route('/max_appointment_slot', name: 'max_appointment_slot', methods: ['GET'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function maxAppointmentSlot(): JsonResponse
    {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->json(['slot' => null]);
        }

        $qb = $this->entityManager
            ->getRepository(Appointment::class)
            ->createQueryBuilder('appointment')
            ->select("date_format(appointment.datetime, 'HH24:MI') AS appointment_time")
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
    public function lastAppointments(): JsonResponse
    {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->json(null);
        }

        $startOfDay = (new \DateTime())->format('Y-m-d 00:00:00');
        $endOfDay = (new \DateTime())->format('Y-m-d 23:59:59');

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
    public function maxOrganisation(): JsonResponse
    {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->json(null);
        }

        $today = new \DateTime();
        $startOfMonth = \DateTime::createFromFormat('Y-m-d H:i:s', $today->format('Y-m-01 00:00:00'));
        $endOfMonth = \DateTime::createFromFormat('Y-m-d H:i:s', $today->format('Y-m-t 23:59:59'));

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

    #[Route('/appointments_per_day', name: 'appointments_per_day', methods: ['GET'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function appointmentsPerDay(): JsonResponse
    {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->json(null);
        }

        $startOfWeek = (new \DateTime())->modify('last monday')->format('Y-m-d');
        $endOfWeek = (new \DateTime())->modify('sunday')->format('Y-m-d');

        $qb = $this->entityManager
            ->getRepository(Appointment::class)
            ->createQueryBuilder('appointment')
            ->where('appointment.datetime BETWEEN :startOfWeek AND :endOfWeek')
            ->setParameter('startOfWeek', $startOfWeek)
            ->setParameter('endOfWeek', $endOfWeek);

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            $qb->andWhere('appointment.provider = :user')
                ->setParameter('user', $user);
        }

        $appointments = $qb
            ->select([
                "date_format(appointment.datetime, 'YYYY-MM-DD') AS day",
                "COUNT(appointment.id) AS appointment_count",
            ])
            ->groupBy('day')
            ->getQuery()
            ->getResult();

        $result = array_fill(0, 7, 0);

        foreach ($appointments as $appointment) {
            $dayOfWeek = (new \DateTime($appointment['day']))->format('w');
            $result[$dayOfWeek] = $appointment['appointment_count'];
        }

        return $this->json($result);
    }
}