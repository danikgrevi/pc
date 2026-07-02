<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $orders = $user->orders()->with('items.product')->latest()->get();
        return response()->json([
            'orders' =>OrderResource::collection($orders),
        ]);
    }
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();
        if (!$cart || $cart->items->isEmpty())
        {
            return response()->json([
            'message' => 'Корзина пустая'
            ],422);
        }
        foreach ($cart->items as $cartItem)
        {
            if ($cartItem->product->stock < $cartItem->quantity)
            {
                return response()->json([
                    'message' => "Товар '{$cartItem->product->name}' недоступен в количестве {$cartItem->quantity}. Доступно: {$cartItem->product->stock}"
                ], 422);
            }
        }
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-' . Str::upper(Str::random(8)),
            'total_amount' => $cart->total_price,
            'status' => 'pending',
            'shipping_address' => $request->shipping_address,
            'billing_address' => $request->billing_address,
            'customer_phone' => $request->customer_phone,
            'notes' => $request->notes,
        ]);
        foreach ($cart->items as $cartItem)
            {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->price,
                    'total_price' => $cartItem->price * $cartItem->quantity,
                ]);
                $cartItem->product->decrement('stock',$cartItem->quantity);
            }
            $cart->items()->delete();
            $cart->update(['total_price' => 0]);
            return response()->json([
                'message' => 'Заказ успешно создан!',
                'order' => $order->load('items.product')
            ],201);
    }
    public function show(Request $request, Order $order) : JsonResponse
    {
        if ($order->user_id !== $request->user()->id)
        {
            return response()->json([
                'message' => 'Доступ запрещен!'
            ],403);
        }
        return response()->json([
            'order' => new OrderResource($order->load('items.product'))
        ]);
    }
    public function cancel(Request $request, Order $order) : JsonResponse
    {
        if ($order->user_id !== $request->user()->id)
        {
            return response()->json([
                'message' => 'Доступ запрещен!'
            ],403);
        }
        if ($order->status !== 'pending')
        {
            return response()->json([
                'message' => 'Можно отменить заказы со статусом "pending"'
            ],422);
        }
        foreach ($order->items as $item)
        {
            $item->product->increment('stock',$item->quantity);
        }
        $order->update(['status' => 'cancelled']);
        return response()->json([
            'message' => 'Заказ отменен',
            'order' => new OrderResource($order->load('items.product'))
        ]);
    }
}
