<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .statistics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-card {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            border-left: 4px solid #4f46e5;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
            margin: 10px 0;
        }
        .stat-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: white;
        }
        .products-table th {
            background-color: #4f46e5;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        .products-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .products-table tr:hover {
            background-color: #f9fafb;
        }
        .product-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-row {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .no-sales {
            text-align: center;
            padding: 40px;
            color: #666;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Daily Sales Report</h1>
        <p style="margin: 5px 0 0 0;">{{ $date->format('M d, Y') }}</p>
    </div>

    @if($purchasedItems->isEmpty())
        <div class="no-sales">
            <h2>No Sales Today</h2>
            <p>No products were sold on {{ $date->format('M d, Y') }}.</p>
        </div>
    @else
        @if($statistics)
        <div class="statistics">
            <div class="stat-card">
                <div class="stat-label">Total Items</div>
                <div class="stat-value">{{ number_format($statistics['total_items'], 0, '.', ',') }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">${{ number_format($statistics['total_revenue'], 2, '.', ',') }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Unique Products</div>
                <div class="stat-value">{{ $statistics['unique_products'] }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Unique Customers</div>
                <div class="stat-value">{{ $statistics['unique_customers'] }}</div>
            </div>
        </div>
        @endif

        <h2>Sales Details</h2>
        <table class="products-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                    <th class="text-center">Customer</th>
                    <th class="text-center">Time</th>
                </tr>
            </thead>
            <tbody>
                @foreach($purchasedItems as $item)
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            @if($item->product->image_url)
                            <img src="{{ $item->product->image_url }}" alt="{{ $item->product->name }}" class="product-image">
                            @endif
                            <span>{{ $item->product->name }}</span>
                        </div>
                    </td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->price, 2, '.', ',') }}</td>
                    <td class="text-right"><strong>${{ number_format($item->quantity * $item->price, 2, '.', ',') }}</strong></td>
                    <td class="text-center">{{ $item->user->name }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($item->purchased_at)->format('H:i') }}</td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="3"><strong>Grand Total</strong></td>
                    <td class="text-right">
                        <strong>${{ number_format($purchasedItems->sum(function($item) { return $item->quantity * $item->price; }), 2, '.', ',') }}</strong>
                    </td>
                    <td colspan="2"></td>
                </tr>
            </tbody>
        </table>
    @endif

    <div class="footer">
        <p>This is an automated report generated by the sales management system.</p>
        <p>&copy; {{ date('Y') }} ShopCart - All rights reserved</p>
    </div>
</body>
</html>
