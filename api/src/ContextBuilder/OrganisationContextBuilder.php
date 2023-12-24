<?php

declare(strict_types=1);

namespace App\ContextBuilder;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use App\Entity\Organisation;
use App\Enum\GroupsEnum;
use App\Enum\RolesEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\AutowireDecorated;
use Symfony\Component\HttpFoundation\Request;

#[AsDecorator(decorates: 'api_platform.serializer.context_builder', priority: 100)]
class OrganisationContextBuilder implements SerializerContextBuilderInterface
{
    public function __construct(
        #[AutowireDecorated] protected SerializerContextBuilderInterface $decorated,
        protected Security $security,
    ) {
    }

    public function createFromRequest(Request $request, bool $normalization, array $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);
        $resourceClass = $context['resource_class'] ?? null;

        // If no groups is defined
        if (!isset($context['groups'])) {
            return $context;
        }

        if ($resourceClass !== Organisation::class) {
            return $context;
        }

        if ($normalization) {
            return $this->getNormalizedContext($context);
        } else {
            return $this->getDenormalizedContext($context);
        }
    }

    private function getNormalizedContext($context): array
    {
        if (null === $this->security->getUser()) {
            return $context;
        }

        if ($this->security->isGranted(RolesEnum::EMPLOYEE->value)) {
            $context['groups'][] = GroupsEnum::ORGANISATION_READ_DETAILED_LOGGED->value;
            return $context;
        }
        return $context;
    }

    private function getDenormalizedContext($context): array
    {
        return $context;
    }
}
