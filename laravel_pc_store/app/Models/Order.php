<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    //
    use HasFactory;
    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'shipping_address',
        'billing_address',
        'customer_phone',
        'notes',
    ];
    protected $casts = [
        'total_amount' => 'decimal:2',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
    public function scopePending($query)
    {
        return $query->where('status','pending');
    }
    public function scopeCompleted($query)
    {
        return $query->where('status','completed');
    }
    public function scopeCancelled($query)
    {
        return $query->where('status','cancelled');
    }
}
