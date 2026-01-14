<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ProductController::class, 'index'])->name('dashboard');
    Route::get('listcommand', function () {
        return Inertia::render('listcommand');
    })->name('listcommand');

    // Cart API routes
    Route::prefix('api/cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/', [CartController::class, 'store'])->name('store');
        Route::put('/{cartItem}', [CartController::class, 'update'])->name('update');
        Route::get('/{cartItem}/delete', [CartController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/settings.php';
