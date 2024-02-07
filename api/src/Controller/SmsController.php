<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Enum\RolesEnum;
use App\Services\SmsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/sms')]
#[AsController]
#[ApiResource]
#[IsGranted(RolesEnum::ADMIN->value)]
#[Post(
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
#[Post(
    routePrefix: '/feedback-reminders',
    routeName: 'feedback_reminders',
    openapiContext: [
        'summary' => 'send feedback requests to users by SMS D+1',
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

    #[Route('/feedback-reminders', name: 'feedback_reminders')]
    public function sendFeedbackReminder(): JsonResponse
    {
        $this->smsService->sendFeedbackRequests();
        return $this->json(null);
    }

}
