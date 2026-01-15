<?php

namespace App\Http\Controllers;

use App\Models\PurchasedItem;
use App\Models\CartItem;
use App\Models\Product;
use App\Jobs\SendLowStockNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchasedItemController extends Controller
{
    /**
     * Display a listing of the purchased items for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $purchasedItems = PurchasedItem::where('user_id', Auth::id())
            ->with('product')
            ->orderBy('purchased_at', 'desc')
            ->get();

        $total = $purchasedItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        return response()->json([
            'purchased_items' => $purchasedItems,
            'total' => number_format($total, 2, '.', ''),
        ]);
    }

    /**
     * Store purchased items from cart (place order).
     */
    public function store(Request $request): JsonResponse
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], 400);
        }

        DB::beginTransaction();
        try {
            $purchasedItems = [];

            foreach ($cartItems as $cartItem) {
                // Reload product from database to get current stock (with lock for update)
                $product = Product::lockForUpdate()->findOrFail($cartItem->product_id);

                // Check stock availability
                if ($product->stock < $cartItem->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Insufficient stock for product: ' . $product->name,
                        'product' => $product->name,
                        'available_stock' => $product->stock,
                        'requested_quantity' => $cartItem->quantity,
                    ], 400);
                }

                // Create purchased item
                $purchasedItem = PurchasedItem::create([
                    'user_id' => Auth::id(),
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $product->price,
                    'purchased_at' => now(),
                ]);

                // Update product stock (decrement)
                $product->decrement('stock', $cartItem->quantity);
                
                // Reload product to get updated stock value
                $product->refresh();

                // Check if stock is low (< 10) and dispatch notification job
                if ($product->stock < 10) {
                    SendLowStockNotification::dispatch($product);
                }

                // Delete cart item
                $cartItem->delete();

                $purchasedItem->load('product');
                $purchasedItems[] = $purchasedItem;
            }

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'purchased_items' => $purchasedItems,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to place order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
