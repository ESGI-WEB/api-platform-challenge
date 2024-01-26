<?php

namespace App\Story;

use App\Enum\RolesEnum;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Story;

final class DefaultUsersStory extends Story
{
    public function build(): void
    {
        UserFactory::createMany(10);
        // create an admin user
        UserFactory::createOne([
            'email' => UserFactory::FAKE_ADMIN_EMAIL,
            'roles' => [RolesEnum::ADMIN->value],
        ]);
        // create a provider user
        UserFactory::createOne([
            'email' => UserFactory::FAKE_PROVIDER_EMAIL,
            'roles' => [RolesEnum::PROVIDER->value],
        ]);
        // create a employee user
        UserFactory::createOne([
            'email' => UserFactory::FAKE_EMPLOYEE_EMAIL,
            'roles' => [RolesEnum::EMPLOYEE->value],
        ]);
        // create a provider to validate user
        UserFactory::createOne([
            'email' => UserFactory::FAKE_PROVIDER_TO_VALIDATE_EMAIL,
            'roles' => [RolesEnum::PROVIDER_TO_VALIDATE->value],
        ]);
    }
}
