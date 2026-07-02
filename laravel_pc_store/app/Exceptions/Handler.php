<?php
// app/Exceptions/Handler.php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException as LaravelValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    private function handleApiException($request, Throwable $exception)
    {
        // Наши кастомные исключения
        if ($exception instanceof ApiException) {
            return $exception->render();
        }

        // Обработка ValidationException от Laravel
        if ($exception instanceof LaravelValidationException) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Validation failed',
                    'details' => $exception->errors(),
                    'timestamp' => now()->toISOString(),
                ]
            ], 422);
        }

        // Обработка аутентификации
        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Authentication required',
                    'details' => [],
                    'timestamp' => now()->toISOString(),
                ]
            ], 401);
        }

        // Обработка 404 ошибок
        if ($exception instanceof ModelNotFoundException || $exception instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Resource not found',
                    'details' => [
                        'path' => $request->path(),
                        'method' => $request->method(),
                    ],
                    'timestamp' => now()->toISOString(),
                ]
            ], 404);
        }

        // Общая обработка ошибок сервера
        $response = [
            'success' => false,
            'error' => [
                'code' => 'INTERNAL_ERROR',
                'message' => config('app.debug') ? $exception->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ]
        ];

        if (config('app.debug')) {
            $response['error']['trace'] = $exception->getTrace();
            $response['error']['file'] = $exception->getFile();
            $response['error']['line'] = $exception->getLine();
        }

        return response()->json($response, 500);
    }
}