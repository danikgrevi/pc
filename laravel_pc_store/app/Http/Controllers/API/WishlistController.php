<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Получить избранные товары пользователя
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Безопасно получаем избранные товары
        $wishlistItems = $user->wishlists()->with('product.category')->get();
        
        $products = $wishlistItems->map(function ($wishlistItem) {
            return $wishlistItem->product;
        })->filter(); // Убираем null элементы

        return response()->json([
            'wishlist' => ProductResource::collection($products),
            'count' => $products->count(),
        ]);
    }

    /**
     * Добавить товар в избранное
     */
    public function add(Request $request, $productId): JsonResponse
    {
        $user = $request->user();
        
        // Находим товар
        $product = Product::find($productId);
        
        if (!$product) {
            return response()->json([
                'message' => 'Товар не найден'
            ], 404);
        }

        // Проверяем не добавлен ли уже товар
        $exists = Wishlist::where('user_id', $user->id)
                         ->where('product_id', $productId)
                         ->exists();
                         
        if ($exists) {
            return response()->json([
                'message' => 'Товар уже в избранном'
            ], 422);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);

        return response()->json([
            'message' => 'Товар добавлен в избранное',
            'product' => new ProductResource($product->load('category'))
        ], 201);
    }

    /**
     * Удалить товар из избранного
     */
    public function remove(Request $request, $productId): JsonResponse
    {
        $user = $request->user();
        
        $deleted = Wishlist::where('user_id', $user->id)
                          ->where('product_id', $productId)
                          ->delete();

        if ($deleted) {
            return response()->json([
                'message' => 'Товар удален из избранного'
            ]);
        }

        return response()->json([
            'message' => 'Товар не найден в избранном'
        ], 404);
    }

    /**
     * Проверить находится ли товар в избранном
     */
    public function check(Request $request, $productId): JsonResponse
    {
        $user = $request->user();
        
        $inWishlist = Wishlist::where('user_id', $user->id)
                             ->where('product_id', $productId)
                             ->exists();

        return response()->json([
            'in_wishlist' => $inWishlist
        ]);
    }

    /**
     * Очистить избранное
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->wishlists()->delete();

        return response()->json([
            'message' => 'Избранное очищено'
        ]);
    }
}