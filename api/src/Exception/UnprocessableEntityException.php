<?php

namespace App\Exception;

class UnprocessableEntityException
{
    public function __construct(
        private string $message = 'Unprocessable Entity',
        private int $code = 422,
        private array $errors = [],
    ) {
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function getCode(): int
    {
        return $this->code;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

}