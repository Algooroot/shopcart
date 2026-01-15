<?php

namespace App\Console\Commands;

use App\Mail\DailySalesReport;
use App\Models\Notification;
use App\Models\PurchasedItem;
use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sales:daily-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily sales report to administrators';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Generating daily sales report...');

        // Get today's date range
        $today = now()->startOfDay();
        $tomorrow = now()->copy()->addDay()->startOfDay();

        // Get all purchased items from today
        $purchasedItems = PurchasedItem::whereBetween('purchased_at', [$today, $tomorrow])
            ->with(['product', 'user'])
            ->get();

        if ($purchasedItems->isEmpty()) {
            $this->warn('No sales found for today.');
            
            // Create notification for no sales
            Notification::create([
                'type' => 'daily_sales_report',
                'title' => 'Daily Sales Report - ' . $today->format('M d, Y'),
                'message' => "No sales recorded on {$today->format('M d, Y')}.",
                'product_id' => null,
                'data' => [
                    'date' => $today->format('Y-m-d'),
                    'total_items' => 0,
                    'total_revenue' => 0,
                    'unique_products' => 0,
                    'unique_customers' => 0,
                ],
            ]);
            
            // Still send report to admins showing no sales
            $this->sendReportToAdmins($purchasedItems, $today);
            return Command::SUCCESS;
        }

        // Calculate statistics
        $totalItems = $purchasedItems->sum('quantity');
        $totalRevenue = $purchasedItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });
        $uniqueProducts = $purchasedItems->pluck('product_id')->unique()->count();
        $uniqueCustomers = $purchasedItems->pluck('user_id')->unique()->count();

        $this->info("Found {$purchasedItems->count()} purchase(s) today");
        $this->info("Total items sold: {$totalItems}");
        $this->info("Total revenue: " . number_format($totalRevenue, 2, '.', ' ') . " €");

        // Create notification in database
        Notification::create([
            'type' => 'daily_sales_report',
            'title' => 'Daily Sales Report - ' . $today->format('M d, Y'),
            'message' => "Sales report for {$today->format('M d, Y')}: {$totalItems} items sold for a total of $" . number_format($totalRevenue, 2, '.', ',') . "",
            'product_id' => null,
            'data' => [
                'date' => $today->format('Y-m-d'),
                'total_items' => $totalItems,
                'total_revenue' => $totalRevenue,
                'unique_products' => $uniqueProducts,
                'unique_customers' => $uniqueCustomers,
            ],
        ]);

        // Send report to admins
        $this->sendReportToAdmins($purchasedItems, $today, [
            'total_items' => $totalItems,
            'total_revenue' => $totalRevenue,
            'unique_products' => $uniqueProducts,
            'unique_customers' => $uniqueCustomers,
        ]);

        $this->info('Daily sales report sent successfully!');
        return Command::SUCCESS;
    }

    /**
     * Send the report to all administrators.
     */
    private function sendReportToAdmins($purchasedItems, $date, $statistics = null): void
    {
        $adminRole = Role::where('slug', 'admin')->first();

        if (!$adminRole) {
            $this->warn('No admin role found.');
            return;
        }

        $adminUsers = $adminRole->users()->get();

        if ($adminUsers->isEmpty()) {
            $this->warn('No admin users found.');
            return;
        }

        foreach ($adminUsers as $admin) {
            Mail::to($admin->email)->send(new DailySalesReport($purchasedItems, $date, $statistics));
            $this->info("Report sent to: {$admin->email}");
        }
    }
}
