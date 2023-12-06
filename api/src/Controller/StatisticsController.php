<?php

namespace App\Controller;

use App\Entity\Appointment;
use App\Enum\RolesEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class StatisticsController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    #[Route('/appointment_count', name: 'appointment_count', methods: ['GET'])]
    public function getAppointmentCount(): JsonResponse
    {
        $user = $this->security->getUser();

        if ($user === null) {
            return $this->json(['count' => 0]);
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
}