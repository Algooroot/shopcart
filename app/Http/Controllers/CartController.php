<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    /**
     * Display a listing of the cart items for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with('product')
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return response()->json([
            'cart_items' => $cartItems,
            'total' => number_format($total, 2, '.', ''),
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Check if product is in stock
        if ($product->stock < $validated['quantity']) {
            throw ValidationException::withMessages([
                'quantity' => 'Insufficient stock. Available: ' . $product->stock,
            ]);
        }

        // Check if item already exists in cart
        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $validated['quantity'];
            
            // Check stock availability
            if ($product->stock < $newQuantity) {
                throw ValidationException::withMessages([
                    'quantity' => 'Insufficient stock. Available: ' . $product->stock,
                ]);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cartItem = CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        $cartItem->load('product');

        return response()->json([
            'message' => 'Product added to cart successfully',
            'cart_item' => $cartItem,
        ], 201);
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cartItem->product;

        // Check stock availability
        if ($product->stock < $validated['quantity']) {
            throw ValidationException::withMessages([
                'quantity' => 'Insufficient stock. Available: ' . $product->stock,
            ]);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);
        $cartItem->load('product');

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart_item' => $cartItem,
        ]);
    }

    /**
     * Remove a product from the cart.
     */
    public function destroy(CartItem $cartItem): JsonResponse
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Product removed from cart successfully',
        ]);
    }
}
