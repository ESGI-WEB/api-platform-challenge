<?php
// api/tests/BooksTest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Organisation;
use App\Factory\OrganisationFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class OrganisationsTest extends ApiTestCase
{
    use ResetDatabase, Factories;

    public function testGetCollection(): void
    {
        OrganisationFactory::createMany(100);
        $response = static::createClient()->request('GET', '/api/organisations?itemsPerPage=10&page=1');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/api/contexts/Organisation',
            '@id' => '/api/organisations',
            '@type' => 'hydra:Collection',
            'hydra:view' => [
                '@id' => '/api/organisations?itemsPerPage=10&page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:next' => '/api/organisations?itemsPerPage=10&page=2',
            ],
        ]);

        $this->assertCount(10, $response->toArray()['hydra:member']);
        $this->assertMatchesResourceCollectionJsonSchema(Organisation::class);
    }
}