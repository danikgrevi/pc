<?php
// app/Exceptions/ApiException.php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class ApiException extends Exception
{
    protected $statusCode;
    protected $errorCode;
    protected $details;

    public function __construct(string $message = '', int $statusCode = 500, string $errorCode = null, array $details = [])
    {
        parent::__construct($message);
        $this->statusCode = $statusCode;
        $this->errorCode = $errorCode ?? $this->getDefaultErrorCode($statusCode);
        $this->details = $details;
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $this->errorCode,
                'message' => $this->getMessage(),
                'details' => $this->details,
                'timestamp' => now()->toISOString(),
            ]
        ], $this->statusCode);
    }

    private function getDefaultErrorCode(int $statusCode): string
    {
        $codes = [
            400 => 'BAD_REQUEST',
            401 => 'UNAUTHORIZED',
            403 => 'FORBIDDEN',
            404 => 'NOT_FOUND',
            422 => 'VALIDATION_ERROR',
            500 => 'INTERNAL_ERROR',
        ];

        return $codes[$statusCode] ?? 'UNKNOWN_ERROR';
    }
}