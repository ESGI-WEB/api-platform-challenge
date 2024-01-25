<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Post;
use App\Entity\Organisation;
use App\Entity\User;
use App\Enum\GroupsEnum;
use App\Enum\RolesEnum;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
#[AsController]
#[ApiResource]
#[Post(
    routePrefix: '/organisations/{id}/add_user',
    routeName: 'add_user_to_organisation',
    openapiContext: [
        'denormalization_context' => ['groups' => GroupsEnum::TEAMS_READ_USER_DETAILED->value],
        'summary' => 'Add user to an organisation',
        'tags' => ['Organisation'],
        'parameters' => [
            [
                'name' => 'organisation_id',
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
                                'user' => ['type' => 'object'],
                                'organisation_id' => ['type' => 'integer'],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
)]
#[Delete(
    routePrefix: '/organisations/{organisation_id}/user/{user_id}/remove_user',
    routeName: 'remove_user_from_organisation',
    openapiContext: [
        'denormalization_context' => ['groups' => GroupsEnum::TEAMS_READ_USER_DETAILED->value],
        'summary' => 'Remove user from an organisation',
        'tags' => ['Organisation'],
        'parameters' => [
            [
                'name' => 'organisation_id',
                'in' => 'path',
                'required' => true,
                'type' => 'integer',
                'description' => 'ID of the organisation',
            ],
            [
                'name' => 'user_id',
                'in' => 'path',
                'required' => true,
                'type' => 'integer',
                'description' => 'ID of the user',
            ],
        ],
        'responses' => [
            '200' => [
                'description' => 'User removed from organisation',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'user' => ['type' => 'object'],
                                'organisation_id' => ['type' => 'integer'],
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
        private readonly UserRepository $userRepository,
        private readonly SerializerInterface $serializer,
    ) {}

    #[Route('/organisations/{id}/add_user', name: 'add_user_to_organisation', methods: ['POST'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
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

    private function addUser(EntityManagerInterface $entityManager, int $organisationId, User $user): void
    {
        $organisation = $entityManager->getRepository(Organisation::class)->find($organisationId);

        if (!$organisation) {
            throw $this->createNotFoundException('No organisation found for id ' . $organisationId);
        }

        $entityManager->transactional(function () use ($organisation, $user) {
            $organisation->addUser($user);
        });
    }

    #[Route('/organisations/{organisation_id}/users/{user_id}/remove_user', name: 'remove_user_from_organisation', methods: ['POST'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function removeUserFromOrganisation(EntityManagerInterface $entityManager, int $organisation_id, int $user_id): JsonResponse
    {

        $foundUser = $this->userRepository->find($user_id);

        if (!$foundUser) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $foundUserOrganisations = $foundUser->getOrganisations();

        foreach ($foundUserOrganisations as $organisation) {
            if ($organisation->getId() === $organisation_id) {
                $this->removeUser($entityManager, $organisation_id, $foundUser);
                $restrictedFoundUser = $this->serializer->normalize($foundUser, null, ['groups' => GroupsEnum::TEAMS_READ_USER_DETAILED->value]);
                return $this->json(['user' => $restrictedFoundUser, 'organisation_id' => $organisation_id]);
            }
        }

        return $this->json(['error' => 'User is not in this organisation'], 400);
    }

    private function removeUser(EntityManagerInterface $entityManager, int $id, User $user): void
    {
        $organisation = $entityManager->getRepository(Organisation::class)->find($id);

        if (!$organisation) {
            throw $this->createNotFoundException('No organisation found for id ' . $id);
        }

        $entityManager->transactional(function () use ($organisation, $user) {
            $organisation->removeUser($user);
        });
    }

}
