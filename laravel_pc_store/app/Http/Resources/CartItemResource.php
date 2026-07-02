<?php
// app/Http/Resources/CartItemResource.php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray($request)
    {
        $product = $this->product;
        $imageUrl = null;
        
        if ($product && $product->image_url) {
            if (str_starts_with($product->image_url, 'http')) {
                $imageUrl = $product->image_url;
            } else {
                $cleanPath = ltrim($product->image_url, '/');
                $imageUrl = asset("storage/{$cleanPath}");
            }
        }

        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'price' => (float) $this->price,
            'product' => $product ? [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'image_url' => $imageUrl,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name
                ] : null
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}