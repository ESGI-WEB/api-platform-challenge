<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Provider\PingProvider;

#[ApiResource(
    uriTemplate: '/ping',
    operations: [
        new Get()
    ],
    provider: PingProvider::class
)]
class Ping
{
    public function getMessage(): string
    {
        return "Pong";
    }
}