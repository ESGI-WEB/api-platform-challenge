<?php

namespace App\Story;

use App\Factory\OrganisationFactory;
use Zenstruck\Foundry\Story;

final class DefaultOrganisationsStory extends Story
{
    public function build(): void
    {
        OrganisationFactory::createMany(10);
    }
}
