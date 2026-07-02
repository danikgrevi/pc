<?php
// app/Exceptions/ValidationException.php

namespace App\Exceptions;

class ValidationException extends ApiException
{
    public function __construct(array $errors)
    {
        parent::__construct(
            'Validation failed',
            422,
            'VALIDATION_ERROR',
            $errors
        );
    }
}