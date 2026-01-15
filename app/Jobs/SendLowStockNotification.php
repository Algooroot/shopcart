<?php

namespace App\Jobs;

use App\Mail\LowStockNotification;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Role;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendLowStockNotification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Product $product
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get all admin users
        $adminRole = Role::where('slug', 'admin')->first();
        
        if (!$adminRole) {
            return;
        }

        $adminUsers = $adminRole->users()->get();

        if ($adminUsers->isEmpty()) {
            return;
        }

        // Create notification in database
        Notification::create([
            'type' => 'low_stock',
            'title' => 'Low Stock - ' . $this->product->name,
            'message' => "Product \"{$this->product->name}\" has low stock ({$this->product->stock} units). Please restock.",
            'product_id' => $this->product->id,
            'data' => [
                'stock' => $this->product->stock,
                'product_name' => $this->product->name,
            ],
        ]);

        // Send email to each admin
        foreach ($adminUsers as $admin) {
            Mail::to($admin->email)->send(new LowStockNotification($this->product));
        }
    }
}
