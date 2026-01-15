import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { notifications } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Bell, Package, TrendingUp, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Notifications",
        href: notifications().url,
    },
];

interface NotificationProduct {
    id: number;
    name: string;
    image_url: string;
    stock: number;
}

interface PurchasedItem {
    id: number;
    product: {
        id: number;
        name: string;
        image_url: string;
    };
    quantity: number;
    price: number;
    total: number;
    user: {
        id: number;
        name: string;
    };
    purchased_at: string;
}

interface Notification {
    id: number;
    type: 'low_stock' | 'daily_sales_report';
    title: string;
    message: string;
    product: NotificationProduct | null;
    data: {
        date?: string;
        total_items?: number;
        total_revenue?: number;
        unique_products?: number;
        unique_customers?: number;
        purchased_items?: PurchasedItem[];
    };
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const NotificationCard = ({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead: (id: number) => void }) => {
    const getNotificationIcon = () => {
        if (notification.type === 'low_stock') {
            return <Package className="h-5 w-5 text-orange-500" />;
        }
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
    };

    const getNotificationBadgeVariant = (): "default" | "secondary" | "destructive" | "outline" => {
        if (notification.type === 'low_stock') {
            return "destructive";
        }
        return "default";
    };

    return (
        <Card className={cn("transition-all hover:shadow-lg", !notification.is_read && "border-l-4 border-l-primary")}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                            {getNotificationIcon()}
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold">{notification.title}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant={getNotificationBadgeVariant()}>
                                    {notification.type === 'low_stock' ? 'Low Stock' : 'Daily Sales Report'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(notification.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {!notification.is_read && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                            className="shrink-0"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            {notification.product && (
                <CardContent className="pt-0">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <img
                            src={notification.product.image_url}
                            alt={notification.product.name}
                            className="h-12 w-12 object-cover rounded"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{notification.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Current stock: <span className="font-semibold text-destructive">{notification.product.stock}</span> units
                            </p>
                        </div>
                    </div>
                </CardContent>
            )}
            {notification.type === 'daily_sales_report' && notification.data && (
                <CardContent className="pt-0 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted rounded-lg">
                        <div>
                            <p className="text-xs text-muted-foreground">Items Sold</p>
                            <p className="text-lg font-bold">{notification.data.total_items || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Revenue</p>
                            <p className="text-lg font-bold">${Number(notification.data.total_revenue || 0).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Unique Products</p>
                            <p className="text-lg font-bold">{notification.data.unique_products || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Unique Customers</p>
                            <p className="text-lg font-bold">{notification.data.unique_customers || 0}</p>
                        </div>
                    </div>
                    {notification.data.purchased_items && notification.data.purchased_items.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold mb-3">Sold Products</h3>
                            <div className="space-y-2">
                                {notification.data.purchased_items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            className="h-10 w-10 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Quantity: {item.quantity} × ${Number(item.price).toFixed(2)} = ${Number(item.total).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Customer: {item.user.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

const NotificationsPage = () => {
    const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/notifications', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotificationsList(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Error loading notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: number) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/api/notifications/${id}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': csrfToken || '',
                },
                credentials: 'include',
                body: JSON.stringify({ _token: csrfToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update local state
            setNotificationsList(prev => 
                prev.map(notif => 
                    notif.id === id 
                        ? { ...notif, is_read: true, read_at: new Date().toISOString() }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Error updating notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/api/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': csrfToken || '',
                },
                credentials: 'include',
                body: JSON.stringify({ _token: csrfToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            // Update local state
            setNotificationsList(prev => 
                prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            toast.error('Error updating notifications');
        }
    };

    const lowStockNotifications = notificationsList.filter(n => n.type === 'low_stock');
    const salesReportNotifications = notificationsList.filter(n => n.type === 'daily_sales_report');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <section className={cn("py-5 px-4 md:px-6 lg:px-8")}>
                <div className="container mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Notifications</h1>
                            <p className="mt-2 text-muted-foreground">
                                View all your stock notifications and sales reports
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-2"
                            >
                                <CheckCheck className="h-4 w-4" />
                                Mark all as read
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">Loading notifications...</p>
                            </CardContent>
                        </Card>
                    ) : notificationsList.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-lg font-medium">No notifications</p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    You don't have any notifications at the moment.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {lowStockNotifications.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Low Stock Notifications
                                    </h2>
                                    <div className="space-y-4">
                                        {lowStockNotifications.map((notification) => (
                                            <NotificationCard
                                                key={notification.id}
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {salesReportNotifications.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Daily Sales Reports
                                    </h2>
                                    <div className="space-y-4">
                                        {salesReportNotifications.map((notification) => (
                                            <NotificationCard
                                                key={notification.id}
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
};

export default NotificationsPage;
