<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Entity\Answer;
use App\Entity\Appointment;
use App\Entity\Organisation;
use App\Enum\RolesEnum;
use App\Repository\AnswerRepository;
use App\Repository\AppointmentRepository;
use App\Repository\OrganisationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
#[AsController]
#[ApiResource]
#[Get(
    routePrefix: '/statistics',
    routeName: 'appointments_count',
    openapiContext: [
        'summary' => 'Get the number of appointments',
        'parameters' => [],
        'responses' => [
            '200' => [
                'description' => 'The number of appointments',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'count' => [
                                    'type' => 'integer',
                                    'example' => 10,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    description: 'Get the number of appointments',
)]
#[Get(
    routePrefix: '/statistics',
    routeName: 'max_appointment_slot',
    openapiContext: [
        'summary' => 'Get the most popular appointment slot',
        'parameters' => [],
        'responses' => [
            '200' => [
                'description' => 'The most popular appointment slot',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'time' => [
                                    'type' => 'string',
                                    'example' => '2021-06-01 10:00',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    description: 'Get the most popular appointment slot',
)]
#[Get(
    routePrefix: '/statistics',
    routeName: 'last_appointments',
    openapiContext: [
        'summary' => 'Get the last appointments',
        'parameters' => [],
        'responses' => [
            '200' => [
                'description' => 'The last appointments',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'title' => [
                                        'type' => 'string',
                                        'example' => 'John Doe',
                                    ],
                                    'subtitle' => [
                                        'type' => 'string',
                                        'example' => '2021-06-01 10:00',
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'example' => 'Organisation name',
                                    ],
                                    'subdescription' => [
                                        'type' => 'string',
                                        'example' => 'Organisation address',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    description: 'Get the last appointments',
)]
#[Get(
    routePrefix: '/statistics',
    routeName: 'max_organisations',
    openapiContext: [
        'summary' => 'Get the most popular organisations',
        'parameters' => [],
        'responses' => [
            '200' => [
                'description' => 'The most popular organisations',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'title' => [
                                        'type' => 'string',
                                        'example' => 'Organisation name',
                                    ],
                                    'subtitle' => [
                                        'type' => 'string',
                                        'example' => '10',
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'example' => 'Organisation address',
                                    ],
                                    'subdescription' => [
                                        'type' => 'string',
                                        'example' => 'Organisation city',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    description: 'Get the most popular organisations',
)]
#[Get(
    routePrefix: '/statistics',
    routeName: 'appointments_per_day',
    openapiContext: [
        'summary' => 'Get the number of appointments per day',
        'parameters' => [],
        'responses' => [
            '200' => [
                'description' => 'The number of appointments per day',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'integer',
                                'example' => 10,
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    description: 'Get the number of appointments per day (starting on monday)',
)]
#[Get(
    routePrefix: '/statistics',
    routeName: 'last_feedbacks',
    openapiContext: [
        'summary' => 'Get the last feedbacks',
        'parameters' => [],
        'responses' => [
            '200' => [
                'description' => 'The last feedbacks',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'title' => [
                                        'type' => 'string',
                                        'example' => 'John Doe',
                                    ],
                                    'subtitle' => [
                                        'type' => 'string',
                                        'example' => '2021-06-01 10:00',
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'example' => 'Organisation name',
                                    ],
                                    'subdescription' => [
                                        'type' => 'string',
                                        'example' => 'Organisation address',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    description: 'Get the last feedbacks',
)]
class StatisticsController extends AbstractController
{
    public function __construct(
        private readonly AppointmentRepository $appointmentRepository,
        private readonly OrganisationRepository $organisationRepository,
        private readonly AnswerRepository $answerRepository,
        private readonly Security $security)
    {}

    #[Route('/appointments_count', name: 'appointments_count', methods: ['GET'])]
    #[IsGranted(RolesEnum::EMPLOYEE->value)]
    public function getAppointmentCount(): JsonResponse
    {
        return $this->json(['count' => $this->appointmentRepository->countAppointments()]);
    }

    #[Route('/max_appointment_slot', name: 'max_appointment_slot', methods: ['GET'])]
    #[IsGranted(RolesEnum::EMPLOYEE->value)]
    public function maxAppointmentSlot(): JsonResponse
    {
        $result = $this->appointmentRepository->getMostPopularSlot();
        return $this->json($result ? ['time' => $result] : null);
    }

    #[Route('/last_appointments', name: 'last_appointments', methods: ['GET'])]
    #[IsGranted(RolesEnum::EMPLOYEE->value)]
    public function lastAppointments(): JsonResponse
    {
        $startOfDay = (new \DateTime())->format('Y-m-d 00:00:00');
        $endOfDay = (new \DateTime())->format('Y-m-d 23:59:59');

        return $this->json($this->appointmentRepository->getLastCreatedAppointment($startOfDay, $endOfDay));
    }

    #[Route('/max_organisations', name: 'max_organisations', methods: ['GET'])]
    #[IsGranted(RolesEnum::EMPLOYEE->value)]
    public function maxOrganisation(): JsonResponse
    {
        $today = new \DateTime();
        $startOfMonth = \DateTime::createFromFormat('Y-m-d H:i:s', $today->format('Y-m-01 00:00:00'));
        $endOfMonth = \DateTime::createFromFormat('Y-m-d H:i:s', $today->format('Y-m-t 23:59:59'));

        $result = $this->organisationRepository->getOrganisationsWithMoreAppointments(
            $startOfMonth,
            $endOfMonth,
        );

        return $this->json($result);
    }

    #[Route('/appointments_per_day', name: 'appointments_per_day', methods: ['GET'])]
    #[IsGranted(RolesEnum::EMPLOYEE->value)]
    public function appointmentsPerDay(): JsonResponse
    {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->json(null);
        }

        $startOfWeek = (new \DateTime())->modify('last monday')->format('Y-m-d 00:00:00');
        $endOfWeek = (new \DateTime())->modify('sunday')->format('Y-m-d 23:59:59');
        $appointments = $this->appointmentRepository->getNumberOfAppointmentsPerDay(
            $startOfWeek,
            $endOfWeek,
        );

        $result = array_fill(0, 7, 0);

        foreach ($appointments as $appointment) {
            $dayOfWeek = (new \DateTime($appointment['day']))->format('N') - 1; // starts on monday
            $result[$dayOfWeek] = $appointment['appointment_count'];
        }

        return $this->json($result);
    }

    #[Route('/last_feedbacks', name: 'last_feedbacks', methods: ['GET'])]
    #[IsGranted(RolesEnum::EMPLOYEE->value)]
    public function lastFeedbacks(): JsonResponse
    {
        return $this->json($this->answerRepository->getLastFeedbacks(1));
    }
}