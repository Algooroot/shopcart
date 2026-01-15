<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchasedItem extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'price',
        'purchased_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'price' => 'decimal:2',
            'purchased_at' => 'datetime',
        ];
    }

    /**
     * Get the user that purchased the item.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that was purchased.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
