<?php
// api/tests/BooksTest.php

namespace App\Tests;

use App\Entity\Organisation;
use App\Entity\Schedule;
use App\Entity\Service;
use App\Entity\User;
use App\Enum\RolesEnum;
use App\Factory\OrganisationFactory;
use App\Factory\ScheduleFactory;
use App\Factory\ServiceFactory;
use App\Factory\UserFactory;
use App\Story\DefaultOrganisationsStory;
use App\Story\DefaultUsersStory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class AvailableSlotTest extends AbstractTest
{
    use ResetDatabase, Factories;

    protected Proxy|null $organisation = null;
    protected Proxy|null $employee = null;
    protected Proxy|null $service = null;
    protected Proxy|null $schedule = null;

    // before each test, load the default organisations
    public function setUp(): void
    {
        parent::setUp();

        $this->employee = UserFactory::createOne(['roles' => [RolesEnum::EMPLOYEE]]);
        $this->organisation = OrganisationFactory::createOne(['users' => [$this->employee]]);
        $this->service = ServiceFactory::createOne(['organisation' => $this->organisation]);
        $this->schedule = ScheduleFactory::createOne(['provider' => $this->employee, 'organisation' => $this->organisation]);

    }

    public function testGetCollection(): void
    {
        $this->createClientWithCredentials()->request('GET', '/api/organisations/' . $this->organisation->getId() . '/available-slots', [
            'headers' => [
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/json; charset=utf-8');
    }

    public function testGetCollectionWithoutCredentials(): void
    {
        $this->createClient()->request('GET', '/api/organisations/' . $this->organisation->getId() . '/available-slots', [
            'headers' => [
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ],
        ]);

        $this->assertResponseStatusCodeSame(401);
    }
}