<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(): Response
    {
        $products = Product::orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'products' => $products,
        ]);
    }

    /**
     * Update the stock of a product.
     */
    public function updateStock(Request $request, Product $product): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $product->stock = $request->stock;
        $product->save();

        return response()->json([
            'message' => 'Stock updated successfully',
            'product' => $product,
        ]);
    }
}
