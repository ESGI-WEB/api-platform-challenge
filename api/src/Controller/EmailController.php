<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Enum\RolesEnum;
use App\Repository\UserRepository;
use App\Services\EmailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
#[AsController]
#[ApiResource]
#[Post(
    routePrefix: '/send_email_to_validate_provider/{id}',
    routeName: 'send_email_to_validate_provider',
    openapiContext: [
        'summary' => 'Send email validation to validate a new provider',
        'tags' => ['Email'],
        'parameters' => [
            [
                'name' => 'id',
                'in' => 'path',
                'required' => true,
                'type' => 'integer',
                'description' => 'ID of the new provider to be validated',
            ],
        ],
        'responses' => [
            '200' => [
                'description' => 'Email sent',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'Messages' => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'Status' => [
                                                'type' => 'integer',
                                                'description' => 'HTTP status code',
                                            ],
                                            'To' => [
                                                'type' => 'array',
                                                'items' => [
                                                    'type' => 'object',
                                                    'properties' => [
                                                        'Email' => [
                                                            'type' => 'string',
                                                            'description' => 'Email address of the recipient',
                                                        ],
                                                        'MessageUUID' => [
                                                            'type' => 'string',
                                                            'description' => 'Unique identifier of the message',
                                                        ],
                                                        'MessageID' => [
                                                            'type' => 'string',
                                                            'description' => 'Unique identifier of the message',
                                                        ],
                                                        'MessageHref' => [
                                                            'type' => 'string',
                                                            'description' => 'URL to the message',
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
)]
class EmailController extends AbstractController
{
    public function __construct(
        private readonly EmailService $emailService,
        private readonly UserRepository $userRepository,
    ) {}

    #[Route('/send_email_to_validate_provider/{id}', name: 'send_email_to_validate_provider', methods: ['POST'])]
    #[IsGranted(RolesEnum::EMPLOYEE->value)]
    public function sendEmailToValidateProvider($id): JsonResponse
    {
        $newProvider = $this->userRepository->find($id);
        $emailAdmin = $this->getParameter('$emailSender');

        if (!$newProvider) {
            throw new UnprocessableEntityHttpException('User not found');
        }

        if (!$emailAdmin) {
            throw new UnprocessableEntityHttpException('Admin email not found');
        }

        return $this->json($this->emailService->sendValidationEmail($emailAdmin, $newProvider));
    }
}
