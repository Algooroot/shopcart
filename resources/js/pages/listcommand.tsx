import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { listcommand } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Package, Calendar, DollarSign, Eye, X } from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
    id: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    currency: string;
}

const STATIC_ORDERS: Order[] = [
    {
        id: "1",
        orderNumber: "ORD-2026-001",
        date: "2026-01-10",
        status: "delivered",
        items: [
            {
                id: 1,
                productName: "Iphone",
                productImage: "https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D",
                quantity: 1,
                price: 899.99,
            },
            {
                id: 2,
                productName: "Macbook Pro",
                productImage: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww",
                quantity: 1,
                price: 2499.99,
            },
        ],
        total: 3399.98,
        currency: "USD",
    },
    {
        id: "2",
        orderNumber: "ORD-2026-002",
        date: "2026-01-12",
        status: "shipped",
        items: [
            {
                id: 3,
                productName: "Parfum",
                productImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
                quantity: 2,
                price: 89.99,
            },
            {
                id: 4,
                productName: "Lunette",
                productImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZSUyMGNvbW1lcmNlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
                quantity: 1,
                price: 149.99,
            },
        ],
        total: 329.97,
        currency: "USD",
    },
    {
        id: "3",
        orderNumber: "ORD-2026-003",
        date: "2026-01-13",
        status: "processing",
        items: [
            {
                id: 5,
                productName: "Basket",
                productImage: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZSUyMGNvbW1lcmNlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
                quantity: 1,
                price: 129.99,
            },
            {
                id: 6,
                productName: "Tshirt",
                productImage: "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
                quantity: 3,
                price: 29.99,
            },
        ],
        total: 219.96,
        currency: "USD",
    },
    {
        id: "4",
        orderNumber: "ORD-2026-004",
        date: "2026-01-14",
        status: "pending",
        items: [
            {
                id: 7,
                productName: "Ukelele",
                productImage: "https://images.unsplash.com/photo-1547517023-c1afcd607fce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
                quantity: 1,
                price: 199.99,
            },
        ],
        total: 199.99,
        currency: "USD",
    },
    {
        id: "5",
        orderNumber: "ORD-2026-005",
        date: "2026-01-08",
        status: "cancelled",
        items: [
            {
                id: 8,
                productName: "Écouteur",
                productImage: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
                quantity: 2,
                price: 79.99,
            },
        ],
        total: 159.98,
        currency: "USD",
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Orders",
        href: listcommand().url,
    },
];

const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "delivered":
            return "default";
        case "shipped":
            return "default";
        case "processing":
            return "secondary";
        case "pending":
            return "outline";
        case "cancelled":
            return "destructive";
        default:
            return "outline";
    }
};

const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
        case "delivered":
            return "Delivered";
        case "shipped":
            return "Shipped";
        case "processing":
            return "Processing";
        case "pending":
            return "Pending";
        case "cancelled":
            return "Cancelled";
        default:
            return status;
    }
};

const formatCurrency = (value: number, currency: string = "USD", locale: string = "en-US"): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
};

const OrderCard = ({ order }: { order: Order }) => {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">{order.orderNumber}</CardTitle>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(order.date)}</span>
                            </div>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                {getStatusLabel(order.status)}
                            </Badge>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <DollarSign className="h-5 w-5" />
                            <span>{formatCurrency(order.total, order.currency)}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                                <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">{item.productName}</h4>
                                <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} × {formatCurrency(item.price, order.currency)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">
                                    {formatCurrency(item.price * item.quantity, order.currency)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-3 border-t pt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                </div>
                <div className="flex items-center gap-2">
                    {order.status !== "cancelled" && (
                        <Button variant="outline" size="sm">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    )}
                    <Button variant="default" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

const OrdersList = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <section className={cn("py-5 px-4 md:px-6 lg:px-8")}>
                <div className="container mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">My Orders</h1>
                        <p className="mt-2 text-muted-foreground">
                            View and manage all your orders
                        </p>
                    </div>
                    <div className="space-y-4">
                        {STATIC_ORDERS.length > 0 ? (
                            STATIC_ORDERS.map((order) => <OrderCard key={order.id} order={order} />)
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-lg font-medium">No orders found</p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        You haven't placed any orders yet.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
};

export default OrdersList;
