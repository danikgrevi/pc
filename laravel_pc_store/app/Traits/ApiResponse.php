<?php
// app/Traits/ApiResponse.php

namespace App\Traits;

trait ApiResponse
{
    protected function success($data = null, string $message = null, int $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $statusCode);
    }

    protected function error(string $message, string $errorCode = null, array $details = [], int $statusCode = 400)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $errorCode,
                'message' => $message,
                'details' => $details,
                'timestamp' => now()->toISOString(),
            ]
        ], $statusCode);
    }

    protected function created($data = null, string $message = 'Resource created successfully')
    {
        return $this->success($data, $message, 201);
    }

    protected function noContent(string $message = 'Resource deleted successfully')
    {
        return $this->success(null, $message, 204);
    }
}