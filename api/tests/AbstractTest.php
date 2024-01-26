<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Enum\RolesEnum;
use App\Factory\UserFactory;

abstract class AbstractTest extends ApiTestCase
{
    private ?string $token = null;

    public function setUp(): void
    {
        self::bootKernel();
    }

    protected function createClientWithCredentials(RolesEnum $role = RolesEnum::USER, $token = null): Client
    {
        $this->token = $token ?: $this->getToken($role);
        return static::createClient([], ['headers' => ['authorization' => 'Bearer ' . $this->token]]);
    }

    protected function getToken(RolesEnum $role): string
    {
        if ($this->token) {
            return $this->token;
        }

        // create a user
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/users',
            [
                'json' => [
                    'email' => UserFactory::FAKE_TEST_EMAIL,
                    'plainPassword' => UserFactory::FAKE_PWD,
                    'firstname' => 'test',
                    'lastname' => 'test',
                ]
            ]
        );

        // update user role
        $entityManager = $client->getContainer()->get('doctrine')->getManager();
        $user = UserFactory::repository()->findOneBy(['email' => UserFactory::FAKE_TEST_EMAIL]);
        $user->setRoles([$role->value]);
        $entityManager->flush();


        // login
        $response = static::createClient()->request(
            'POST',
            '/api/login',
            [
                'json' => [
                    'email' => UserFactory::FAKE_TEST_EMAIL,
                    'password' => UserFactory::FAKE_PWD,
                ]
            ]
        );

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();

        return $data['token'];
    }
}