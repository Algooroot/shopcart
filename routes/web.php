<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchasedItemController;
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
    Route::get('notifications', [NotificationController::class, 'index'])->middleware('admin')->name('notifications');

    // Cart API routes
    Route::prefix('api/cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/', [CartController::class, 'store'])->name('store');
        Route::put('/{cartItem}', [CartController::class, 'update'])->name('update');
        Route::get('/{cartItem}/delete', [CartController::class, 'destroy'])->name('destroy');
    });

    // Purchased Items API routes
    Route::prefix('api/purchased-items')->name('purchased-items.')->group(function () {
        Route::get('/', [PurchasedItemController::class, 'index'])->name('index');
        Route::post('/', [PurchasedItemController::class, 'store'])->name('store');
    });

    // Notifications API routes (admin only)
    Route::prefix('api/notifications')->name('notifications.')->middleware('admin')->group(function () {
        Route::get('/', [NotificationController::class, 'getAll'])->name('index');
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::get('/daily-sales-report', [NotificationController::class, 'getDailySalesReport'])->name('daily-sales-report');
    });
});

require __DIR__.'/settings.php';
