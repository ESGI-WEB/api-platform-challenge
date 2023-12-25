<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\ServiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/names')]
#[AsController]
#[ApiResource]
#[GetCollection(
    routePrefix: '/services',
    routeName: 'names_services',
    openapiContext: [
        'summary' => 'Get services grouped by name',
        'tags' => ['Service'],
        'parameters' => [],
        'responses' => [
            '200' => [
                'description' => 'Services grouped by name',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'name' => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'string',
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
class NamesController extends AbstractController
{
    public function __construct(
        private readonly ServiceRepository $serviceRepository,
    ) {
    }

    #[Route('/services', name: 'names_services', methods: ['GET'])]
    public function getServicesGroupedByName(): JsonResponse
    {
        return $this->json($this->serviceRepository->getServicesGroupedBy('title'));
    }
}
