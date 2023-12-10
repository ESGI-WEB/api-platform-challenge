<?php

namespace App\Controller;

use App\Entity\Appointment;
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

        if ($this->security->isGranted(RolesEnum::ADMIN->value)) {
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

        if ($this->security->isGranted(RolesEnum::PROVIDER->value)) {
            $qb->andWhere('appointment.provider = :user')
                ->setParameter('user', $user);
        }

        $result = $qb->getQuery()->getSingleResult();

        return $this->json(['time' => $result['appointment_time']]);
    }

}