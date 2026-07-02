<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if(!$this->resource)
        {
            return [];
        }
        return 
        [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'total_amount' => $this->total_amount,
            'formatted_total_amount' => number_format($this->total_amount,2,'.',' ') . ' BYN',
            'status' => $this->status,
            'status_text' => $this->getStatusText(),
            'shipping_address' => $this->shipping_address,
            'billing_address' =>$this->billing_address,
            'customer_phone' =>$this->customer_phone,
            'notes' => $this->notes,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'items_count' => $this->whenLoaded('items', function () {
                return $this->items->count();
            }),
            'created_at' =>$this->created_at,
            'formatted_created_at' => $this->created_at->format('d.m.Y H:i'),
            'updated_at' =>$this->updated_at
        ];
    }
    protected function getStatusText(): string
    {
        return match ($this->status) {
            'pending' => 'В обработке',
            'processing' => 'Обрабатывается',
            'completed' => 'Завершен',
            'cancelled' => 'Отменен',
            default => 'Неизвестен'
        };
    }
}
