<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\WishlistController;
use App\Models\Cart;
use App\Models\Order;
use App\Http\Controllers\API\UserController;

// Публичные маршруты
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Аутентификация
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Защищенные маршруты (используем встроенный auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
     Route::prefix('orders')->group(function()
    {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{order}' ,[OrderController::class, 'show']);
        Route::post('/{order}/cancel' ,[OrderController::class, 'cancel']);
    });
    // Пользователь
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Админские функции
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    Route::prefix('cart')->group(function () {
        Route::get('/',[CartController::class,'index']);
        Route::get('/count',[CartController::class,'getCount']);
        Route::get('/total',[CartController::class,'getTotal']);
        Route::post('/add',[CartController::class,'addItem']);
        Route::put('/items/{cartItem}',[CartController::class,'updateItem']);
        Route::delete('/items/{cartItem}',[CartController::class,'removeItem']);
        Route::delete('/clear',[CartController::class,'clear']);
    });
    Route::prefix('wishlist')->group(function () {
        Route::get('/',[WishlistController::class,'index']);
        Route::post('/add/{productId}',[WishlistController::class,'add']);
        Route::delete('/remove/{productId}',[WishlistController::class,'remove']);
        Route::get('/check/{productId}',[WishlistController::class,'check']);
        Route::delete('/clear',[WishlistController::class,'clear']);
    });
    // В защищенной группе auth:sanctum
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);          // Список пользователей
        Route::get('/count', [UserController::class, 'count']);     // Количество пользователей
        Route::get('/stats', [UserController::class, 'stats']);     // Статистика
        Route::get('/current', [UserController::class, 'current']); // Текущий пользователь
        Route::get('/{user}', [UserController::class, 'show']);     // Конкретный пользователь
});
   // В защищенной группе auth:sanctum
        Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
});

// Тестовый маршрут
Route::get('/test', function () {
    return response()->json(['message' => 'API работает!']);
});

// Маршрут для товаров категории
Route::get('/categories/{category}/products', function ($categoryId) {
    $category = \App\Models\Category::with('products')->findOrFail($categoryId);
    return \App\Http\Resources\CategoryResource::make($category);
});
// Временный маршрут для отладки корзины

