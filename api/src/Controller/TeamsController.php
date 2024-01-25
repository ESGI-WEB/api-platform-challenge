<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Entity\Organisation;
use App\Enum\GroupsEnum;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/teams')]
#[AsController]
#[ApiResource]
#[Post(
    routePrefix: '/organisations/{id}/add_user',
    routeName: 'add_user_to_organisation',
    openapiContext: [
        'denormalization_context' => ['groups' => GroupsEnum::TEAMS_READ_USER_DETAILED->value],
        'summary' => 'Add user to an organisation',
        'tags' => ['Teams'],
        'parameters' => [
            [
                'name' => 'id',
                'in' => 'path',
                'required' => true,
                'type' => 'integer',
                'description' => 'ID of the organisation',
            ],
        ],
        'responses' => [
            '200' => [
                'description' => 'User added to organisation',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'email' => ['type' => 'string'],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
)]
class TeamsController extends AbstractController
{
    public function __construct(
        private readonly UserRepository      $userRepository,
        private readonly SerializerInterface $serializer,
    ) {}

    #[Route('/organisations/{id}/add_user', name: 'add_user_to_organisation', methods: ['POST'])]
    public function addUserToOrganisation(EntityManagerInterface $entityManager, int $id, Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);

        $email = $requestData['email'] ?? null;

        $foundUser = $this->userRepository->findEmployeeByEmail($email);

        if (!$foundUser) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $foundUserOrganisations = $foundUser->getOrganisations();

        foreach ($foundUserOrganisations as $organisation) {
            if ($organisation->getId() === $id) {
                return $this->json(['error' => 'User is already in this organisation'], 400);
            }
        }

        $this->addUser($entityManager, $id, $foundUser);

        $restrictedFoundUser = $this->serializer->normalize($foundUser, null, ['groups' => GroupsEnum::TEAMS_READ_USER_DETAILED->value]);

        return $this->json(['user' => $restrictedFoundUser, 'organisation_id' => $id]);
    }

    private function addUser(EntityManagerInterface $entityManager, $organisationId, $user): void
    {
        $organisation = $entityManager->getRepository(Organisation::class)->find($organisationId);

        if (!$organisation) {
            throw $this->createNotFoundException('No organisation found for id ' . $organisationId);
        }

        $entityManager->transactional(function () use ($organisation, $user) {
            $organisation->addUser($user);
        });
    }

}
