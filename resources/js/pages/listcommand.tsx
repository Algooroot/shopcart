import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { listcommand } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import QuantityPicker from "@/components/quantity-picker";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Cart",
        href: listcommand().url,
    },
];

const formatCurrency = (value: number, currency: string = "USD", locale: string = "en-US"): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);
};

const CartItemCard = ({ cartItem }: { cartItem: any }) => {
    const { updateCartItem, removeFromCart } = useCart();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
        setIsUpdating(true);
        try {
            await updateCartItem(cartItem.id, newQuantity);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await removeFromCart(cartItem.id);
        } finally {
            setIsDeleting(false);
        }
    };

    const itemTotal = cartItem.quantity * cartItem.product.price;

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                            src={cartItem.product.image_url}
                            alt={cartItem.product.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-lg truncate">{cartItem.product.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {formatCurrency(cartItem.product.price, "USD")} each
                        </p>
                        <div className="mt-3">
                            <QuantityPicker
                                quantity={cartItem.quantity}
                                onQuantityChange={handleQuantityChange}
                                min={1}
                                max={cartItem.product.stock}
                                onDelete={handleDelete}
                                showDeleteIcon={true}
                                isLoading={isUpdating || isDeleting}
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold">
                            {formatCurrency(itemTotal, "USD")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Stock: {cartItem.product.stock}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const OrdersListContent = () => {
    const { cartItems, total, cartCount, fetchCart, loading } = useCart();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCsrfToken = (): string | null => {
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            const token = metaToken.getAttribute('content');
            if (token && token.trim() !== '') {
                return token.trim();
            }
        }
        
        const name = 'XSRF-TOKEN';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith(name + '=')) {
                const value = trimmedCookie.substring(name.length + 1);
                const decoded = decodeURIComponent(value);
                if (decoded && decoded.trim() !== '') {
                    return decoded.trim();
                }
            }
        }
        
        return null;
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0 || total === 0) {
            return;
        }

        setIsPlacingOrder(true);
        try {
            const csrfToken = getCsrfToken();
            
            if (!csrfToken) {
                toast.error('CSRF token not found. Please refresh the page.');
                return;
            }

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrfToken,
            };

            const body: any = {
                _token: csrfToken,
            };

            const response = await fetch('/api/purchased-items', {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to place order';
                let errorDetails = '';
                try {
                    const error = await response.json();
                    errorMessage = error.message || error.error || errorMessage;
                    if (error.product) {
                        errorDetails = `Product: ${error.product}\nAvailable stock: ${error.available_stock}\nRequested: ${error.requested_quantity}`;
                        toast.error(errorMessage, {
                            description: errorDetails,
                            duration: 5000,
                        });
                    } else {
                        toast.error(errorMessage, {
                            duration: 5000,
                        });
                    }
                } catch (e) {
                    errorMessage = response.statusText || errorMessage;
                    toast.error(errorMessage, {
                        duration: 5000,
                    });
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            toast.success('Order placed successfully!', {
                description: `Your order has been confirmed.`,
                duration: 4000,
            });
            
            // Refresh cart to show empty state
            await fetchCart();
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <>
            <Head title="Shopping Cart" />
            <section className={cn("py-5 px-4 md:px-6 lg:px-8")}>
                <div className="container mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Shopping Cart</h1>
                        <p className="mt-2 text-muted-foreground">
                            Review and manage your cart items
                        </p>
                    </div>
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Cart Total</p>
                                        <p className="text-2xl font-bold">
                                            {loading ? (
                                                <span className="text-muted-foreground">Loading...</span>
                                            ) : (
                                                formatCurrency(total, "USD")
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-4 mb-6">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => <CartItemCard key={item.id} cartItem={item} />)
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-lg font-medium">Your cart is empty</p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Add some products to your cart to get started.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <Card className="sticky bottom-0 z-10">
                            <CardContent className="pt-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ShoppingCart className="h-4 w-4" />
                                        <span>
                                            {cartCount} {cartCount === 1 ? "item" : "items"} in cart
                                        </span>
                                    </div>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        onClick={handlePlaceOrder}
                                        disabled={loading || total === 0 || isPlacingOrder}
                                        className="min-w-[220px]"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        {isPlacingOrder ? 'Placing Order...' : `Place Order (${cartCount}) - ${formatCurrency(total, "USD")}`}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </>
    );
};

const OrdersList = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <OrdersListContent />
        </AppLayout>
    );
};

export default OrdersList;
