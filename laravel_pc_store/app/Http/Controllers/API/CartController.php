<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::with(['items.product.category'])
                    ->where('user_id', $user->id)
                    ->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'total_price' => 0
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $cart
        ]);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['total_price' => 0]
        );

        $product = Product::findOrFail($request->product_id);

        // Проверяем есть ли уже товар в корзине
        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('product_id', $request->product_id)
                            ->first();

        if ($cartItem) {
            // Обновляем количество если товар уже в корзине
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Добавляем новый товар
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price
            ]);
        }

        // Пересчитываем общую сумму корзины
        $this->calculateCartTotal($cart);

        // Загружаем корзину с актуальными данными
        $cart->load(['items.product.category']);

        return response()->json([
            'success' => true,
            'message' => 'Товар добавлен в корзину',
            'data' => $cart
        ]);
    }

    public function updateItem(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        // Проверяем что корзина принадлежит пользователю
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещен'
            ], 403);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        // Пересчитываем общую сумму
        $this->calculateCartTotal($cartItem->cart);

        $cartItem->load(['product.category']);

        return response()->json([
            'success' => true,
            'message' => 'Количество обновлено',
            'data' => $cartItem->cart->load(['items.product.category'])
        ]);
    }

    public function removeItem(CartItem $cartItem)
    {
        // Проверяем что корзина принадлежит пользователю
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещен'
            ], 403);
        }

        $cart = $cartItem->cart;
        $cartItem->delete();

        // Пересчитываем общую сумму
        $this->calculateCartTotal($cart);

        return response()->json([
            'success' => true,
            'message' => 'Товар удален из корзины',
            'data' => $cart->load(['items.product.category'])
        ]);
    }

    public function clear()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            $cart->items()->delete();
            $cart->total_price = 0;
            $cart->save();
        }
        return response()->json([
            'success' => true,
            'message' => 'Корзина очищена',
            'data' => $cart
        ]);
    }

    public function getCount()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        $count = 0;
        if ($cart) {
            $count = $cart->items->sum('quantity');
        }

        return response()->json([
            'success' => true,
            'data' => $count
        ]);
    }

    public function getTotal()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        $total = 0;
        if ($cart) {
            $total = $cart->total_price;
        }

        return response()->json([
            'success' => true,
            'data' => $total
        ]);
    }

    private function calculateCartTotal(Cart $cart)
    {
        $total = $cart->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        $cart->total_price = $total;
        $cart->save();

        return $total;
    }
}