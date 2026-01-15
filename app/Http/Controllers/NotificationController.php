<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PurchasedItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display the notifications page.
     */
    public function index(): Response
    {
        return Inertia::render('notifications');
    }

    /**
     * Get all notifications (API).
     */
    public function getAll(): JsonResponse
    {
        $notifications = Notification::orderBy('created_at', 'desc')
            ->with('product')
            ->get()
            ->map(function ($notification) {
                $data = $notification->data ?? [];
                
                // If it's a daily sales report, fetch purchased items
                if ($notification->type === 'daily_sales_report' && isset($data['date'])) {
                    $date = $data['date'];
                    $startDate = \Carbon\Carbon::parse($date)->startOfDay();
                    $endDate = \Carbon\Carbon::parse($date)->copy()->addDay()->startOfDay();
                    
                    $purchasedItems = PurchasedItem::whereBetween('purchased_at', [$startDate, $endDate])
                        ->with(['product', 'user'])
                        ->get()
                        ->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'product' => [
                                    'id' => $item->product->id,
                                    'name' => $item->product->name,
                                    'image_url' => $item->product->image_url,
                                ],
                                'quantity' => $item->quantity,
                                'price' => (float) $item->price,
                                'total' => (float) ($item->quantity * $item->price),
                                'user' => [
                                    'id' => $item->user->id,
                                    'name' => $item->user->name,
                                ],
                                'purchased_at' => $item->purchased_at->format('Y-m-d H:i:s'),
                            ];
                        });
                    
                    $data['purchased_items'] = $purchasedItems;
                }
                
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'product' => $notification->product ? [
                        'id' => $notification->product->id,
                        'name' => $notification->product->name,
                        'image_url' => $notification->product->image_url,
                        'stock' => $notification->product->stock,
                    ] : null,
                    'data' => $data,
                    'is_read' => $notification->is_read,
                    'read_at' => $notification->read_at?->format('Y-m-d H:i:s'),
                    'created_at' => $notification->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $unreadCount = Notification::where('is_read', false)->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): JsonResponse
    {
        Notification::where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Get daily sales report data.
     */
    public function getDailySalesReport(Request $request): JsonResponse
    {
        $date = $request->input('date', now()->format('Y-m-d'));
        $startDate = \Carbon\Carbon::parse($date)->startOfDay();
        $endDate = \Carbon\Carbon::parse($date)->copy()->addDay()->startOfDay();

        $purchasedItems = PurchasedItem::whereBetween('purchased_at', [$startDate, $endDate])
            ->with(['product', 'user'])
            ->get();

        $totalItems = $purchasedItems->sum('quantity');
        $totalRevenue = $purchasedItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });
        $uniqueProducts = $purchasedItems->pluck('product_id')->unique()->count();
        $uniqueCustomers = $purchasedItems->pluck('user_id')->unique()->count();

        return response()->json([
            'date' => $date,
            'purchased_items' => $purchasedItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'image_url' => $item->product->image_url,
                    ],
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'total' => (float) ($item->quantity * $item->price),
                    'user' => [
                        'id' => $item->user->id,
                        'name' => $item->user->name,
                    ],
                    'purchased_at' => $item->purchased_at->format('Y-m-d H:i:s'),
                ];
            }),
            'statistics' => [
                'total_items' => $totalItems,
                'total_revenue' => (float) $totalRevenue,
                'unique_products' => $uniqueProducts,
                'unique_customers' => $uniqueCustomers,
            ],
        ]);
    }
}
