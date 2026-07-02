<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Exceptions\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator->errors()->toArray());
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->success([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 'User registered successfully', 201);

        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                throw $e;
            }
            
            return $this->error(
                'Registration failed',
                'REGISTRATION_ERROR',
                [],
                500
            );
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator->errors()->toArray());
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->error(
                    'Invalid credentials',
                    'INVALID_CREDENTIALS',
                    [],
                    401
                );
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->success([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 'Login successful');

        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                throw $e;
            }
            
            return $this->error(
                'Login failed',
                'LOGIN_ERROR',
                [],
                500
            );
        }
    }
    /**
 * Регистрация администратора (только для существующих админов)
 */
            public function registerAdmin(Request $request): JsonResponse
            {
                // Проверяем что текущий пользователь администратор
                if (!$request->user() || !$request->user()->is_admin) {
                    return response()->json([
                        'message' => 'Доступ запрещен. Требуются права администратора.'
                    ], 403);
                }

                $validator = Validator::make($request->all(), [
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'password' => 'required|string|min:8|confirmed',
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'errors' => $validator->errors()
                    ], 422);
                }

                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'is_admin' => true, // Устанавливаем флаг администратора
                ]);

                $token = $user->createToken('auth-token')->plainTextToken;

                return response()->json([
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'is_admin' => $user->is_admin,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'message' => 'Администратор успешно создан'
                ], 201);
            }
}