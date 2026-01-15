import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { listcommand } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import QuantityPicker from "@/components/quantity-picker";

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
    const { cartItems, total, fetchCart, loading } = useCart();

    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <div className="space-y-4">
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
