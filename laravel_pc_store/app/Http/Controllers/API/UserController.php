<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Получить список всех пользователей (только для админов)
     */
    public function index(Request $request): JsonResponse
    {
        // Можно добавить проверку на админа позже
        // if (!$request->user()->is_admin) {
        //     return response()->json(['message' => 'Доступ запрещен'], 403);
        // }

        $users = User::select(['id', 'name', 'email', 'created_at', 'updated_at'])
                    ->latest()
                    ->get();

        return response()->json([
            'users' => $users,
            'total' => $users->count()
        ]);
    }

    /**
     * Получить количество пользователей
     */
    public function count(Request $request): JsonResponse
    {
        $count = User::count();

        return response()->json([
            'user_count' => $count
        ]);
    }

    /**
     * Получить информацию о конкретном пользователе
     */
    public function show(Request $request, User $user): JsonResponse
    {
        // Проверяем что пользователь смотрит свои данные или это админ
        // if ($request->user()->id !== $user->id && !$request->user()->is_admin) {
        //     return response()->json(['message' => 'Доступ запрещен'], 403);
        // }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'orders_count' => $user->orders()->count(),
                'cart_items_count' => $user->cart ? $user->cart->items()->count() : 0
            ]
        ]);
    }

    /**
     * Получить текущего авторизованного пользователя
     */
    public function current(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'orders_count' => $user->orders()->count(),
                'wishlist_count' => $user->wishlists()->count()
            ]
        ]);
    }

    /**
     * Получить статистику по пользователям
     */
    public function stats(Request $request): JsonResponse
    {
        $totalUsers = User::count();
        $todayUsers = User::whereDate('created_at', today())->count();
        $weekUsers = User::where('created_at', '>=', now()->subWeek())->count();
        $monthUsers = User::where('created_at', '>=', now()->subMonth())->count();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'today_registered' => $todayUsers,
                'week_registered' => $weekUsers,
                'month_registered' => $monthUsers
            ]
        ]);
    }
}