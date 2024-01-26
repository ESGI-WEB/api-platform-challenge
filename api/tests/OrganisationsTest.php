<?php
// api/tests/BooksTest.php

namespace App\Tests;

use App\Entity\Organisation;
use App\Enum\RolesEnum;
use App\Factory\OrganisationFactory;
use App\Story\DefaultOrganisationsStory;
use App\Story\DefaultUsersStory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class OrganisationsTest extends AbstractTest
{
    use ResetDatabase, Factories;

    public function testGetCollection(): void
    {
        DefaultOrganisationsStory::load();
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

    public function testGetCollectionWithSearch()
    {
        DefaultOrganisationsStory::load();
        OrganisationFactory::createOne(['name' => 'Test Organisation']);

        $response = static::createClient()->request('GET', '/api/organisations', [
            'query' => [
                'search' => 'Test Organisation',
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $response->toArray()['hydra:member']);
        $this->assertMatchesResourceCollectionJsonSchema(Organisation::class);
    }

    public function testCreate()
    {
        DefaultUsersStory::load();
        $this->createClientWithCredentials(RolesEnum::PROVIDER)
            ->request('POST', '/api/organisations', [
                'json' => [
                    'name' => 'Test Organisation',
                    'address' => 'Test Address',
                    'city' => 'Test City',
                    'zipcode' => '75000',
                    'latitude' => '10.0000000000000000',
                    'longitude' => '10.0000000000000000',
                ],
            ]);

        $this->assertResponseIsSuccessful();
        $this->assertMatchesResourceItemJsonSchema(Organisation::class);
        $this->assertJsonContains([
            '@context' => '/api/contexts/Organisation',
            '@type' => 'Organisation',
            'name' => 'Test Organisation',
            'address' => 'Test Address',
            'city' => 'Test City',
            'zipcode' => '75000',
            'latitude' => '10.0000000000000000',
            'longitude' => '10.0000000000000000',
        ]);
    }

    public function testCreateWithInvalidData()
    {
        DefaultUsersStory::load();
        $this->createClientWithCredentials(RolesEnum::PROVIDER)
            ->request('POST', '/api/organisations', [
                'json' => [
                    'name' => '',
                    'address' => '',
                    'city' => '',
                    'zipcode' => '',
                    'latitude' => '',
                    'longitude' => '',
                ],
            ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testCreateWithInvalidRole()
    {
        DefaultUsersStory::load();
        $this->createClientWithCredentials(RolesEnum::EMPLOYEE)
            ->request('POST', '/api/organisations', [
                'json' => [
                    'name' => 'Test Organisation',
                    'address' => 'Test Address',
                    'city' => 'Test City',
                    'zipcode' => '75000',
                    'latitude' => '10.0000000000000000',
                    'longitude' => '10.0000000000000000',
                ],
            ]);

        $this->assertResponseStatusCodeSame(403);
    }
}