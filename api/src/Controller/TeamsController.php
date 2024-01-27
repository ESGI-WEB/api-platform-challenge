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
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
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
            '201' => [
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
    description: 'Add user to an organisation',
)]
#[Delete(
    routePrefix: '/organisations/{organisation_id}/users/{user_id}/remove_user',
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
            '204' => [
                'description' => 'User removed from organisation',
                'content' => [
                    'application/json' => [
                        'schema' => [],
                    ],
                ],
            ],
        ],
    ],
    description: 'Remove user from an organisation',
)]
class TeamsController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly SerializerInterface $serializer,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/organisations/{id}/add_user', name: 'add_user_to_organisation', methods: ['POST'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function addUserToOrganisation(int $id, Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);

        $email = $requestData['email'] ?? null;

        $foundUser = $this->userRepository->findEmployeeAndProviderByEmail($email);

        if (!$foundUser) {
            throw $this->createNotFoundException('No user found for email ' . $email);
        }

        $foundUserOrganisations = $foundUser->getOrganisations();

        foreach ($foundUserOrganisations as $organisation) {
            if ($organisation->getId() === $id) {
                throw new UnprocessableEntityHttpException('User is already in this organisation');
            }
        }

        $this->addUser($id, $foundUser);

        $restrictedFoundUser = $this->serializer->normalize($foundUser, null, ['groups' => GroupsEnum::TEAMS_READ_USER_DETAILED->value]);

        return $this->json(['user' => $restrictedFoundUser, 'organisation_id' => $id]);
    }

    private function addUser(int $organisationId, User $user): void
    {
        $organisation = $this->entityManager->getRepository(Organisation::class)->find($organisationId);

        if (!$organisation) {
            throw $this->createNotFoundException('No organisation found for id ' . $organisationId);
        }

        $this->entityManager->transactional(function () use ($organisation, $user) {
            $organisation->addUser($user);
        });
    }

    #[Route('/organisations/{organisation_id}/users/{user_id}/remove_user', name: 'remove_user_from_organisation', methods: ['DELETE'])]
    #[IsGranted(RolesEnum::PROVIDER->value)]
    public function removeUserFromOrganisation(int $organisation_id, int $user_id): JsonResponse
    {

        $foundUser = $this->userRepository->find($user_id);

        if (!$foundUser) {
            throw $this->createNotFoundException('User not found');
        }

        $foundUserOrganisations = $foundUser->getOrganisations();

        foreach ($foundUserOrganisations as $organisation) {
            if ($organisation->getId() === $organisation_id) {
                $this->removeUser($organisation_id, $foundUser);
                return $this->json([], 204);
            }
        }

        throw new UnprocessableEntityHttpException('User is not in this organisation');
    }

    private function removeUser(int $id, User $user): void
    {
        $organisation = $this->entityManager->getRepository(Organisation::class)->find($id);

        if (!$organisation) {
            throw $this->createNotFoundException('No organisation found for id ' . $id);
        }

        $this->entityManager->transactional(function () use ($organisation, $user) {
            $organisation->removeUser($user);
        });
    }

}
