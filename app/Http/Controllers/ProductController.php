<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(): Response
    {
        $products = Product::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'products' => $products,
        ]);
    }
}
