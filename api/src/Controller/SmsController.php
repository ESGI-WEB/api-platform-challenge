<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\ServiceRepository;
use App\Services\SmsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/sms')]
#[AsController]
#[ApiResource]
#[GetCollection(
    routePrefix: '/user-reminders',
    routeName: 'user_reminders',
    openapiContext: [
        'summary' => 'send appointment reminders to users by SMS D-1',
        'tags' => ['SMS'],
        'parameters' => [],
        'responses' => [
            '200' => [],
        ],
    ],
)]
class SmsController extends AbstractController
{
    public function __construct(
        private readonly SmsService $smsService,
    ) {
    }

    #[Route('/user-reminders', name: 'user_reminders')]
    public function sendUserAppointmentReminders(): JsonResponse
    {
        $this->smsService->sendUserAppointmentReminders();
        return $this->json(null);
    }
}
