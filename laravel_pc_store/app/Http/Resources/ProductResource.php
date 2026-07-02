<?php
// app/Http/Resources/ProductResource.php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        // Формируем правильный URL для изображения
        $imageUrl = null;
        if ($this->image_url) {
            // Если путь уже абсолютный, используем как есть
            if (str_starts_with($this->image_url, 'http')) {
                $imageUrl = $this->image_url;
            } else {
                // Иначе формируем полный URL
                $cleanPath = ltrim($this->image_url, '/');
                $imageUrl = asset("storage/{$cleanPath}");
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'image_url' => $imageUrl,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}