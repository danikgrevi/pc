<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return 
        [
            'id' => $this->id,
            'product_id' =>$this->product_id,
            'product_name' =>$this->product->name ?? 'Неизвестный товар',
            'quantity' => $this->quantity,
            'unit_price' =>$this->unit_price,
            'formatted_unit_price' =>$this->formatted_unit_price,
            'total_price' => $this->total_price,
            'formatted_total_price' => $this->formatted_total_price,
            'product' => new ProductResource($this->whenLoaded('product')),
            'created_at' => $this->created_at,
        ];
    }
}
