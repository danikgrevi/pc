<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Http\Controllers\API\WishlistController;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'stock',
        'image_url'
    ];
    protected $casts = [
        'price' => 'decimal:2',
    ];
    public function category(): BelongsTo
        {
            return $this->belongsTo(Category::class);
        }
    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }
    public function inWishlist($userId = null): bool
    {
        if (!$userId)
        {
            $userId = auth()->id;
        }
        
        if (!$userId)
        {
            return false;
        }
        return $this->wishlists()->where('user_id', $userId)->exists();
    }
}
