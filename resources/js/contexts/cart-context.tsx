import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        image_url: string;
        stock: number;
    };
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    total: number;
    loading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity: number) => Promise<void>;
    updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // Helper function to get CSRF token
    const getCsrfToken = (): string | null => {
        // First, try to get from meta tag (most reliable)
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            const token = metaToken.getAttribute('content');
            if (token) return token;
        }
        
        // Fallback: try to get from XSRF-TOKEN cookie
        const name = 'XSRF-TOKEN';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith(name + '=')) {
                const value = trimmedCookie.substring(name.length + 1);
                return decodeURIComponent(value);
            }
        }
        
        return null;
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/cart', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();
            setCartItems(data.cart_items || []);
            setTotal(parseFloat(data.total || 0));
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: number, quantity: number) => {
        try {
            const csrfToken = getCsrfToken();
            
            if (!csrfToken) {
                console.error('CSRF token not found. Please refresh the page.');
                throw new Error('CSRF token not found. Please refresh the page.');
            }

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrfToken,
            };

            const body: any = {
                product_id: productId,
                quantity: quantity,
                _token: csrfToken, // Laravel also accepts token in body
            };

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to add to cart';
                try {
                    const error = await response.json();
                    errorMessage = error.message || error.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            await fetchCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const updateCartItem = async (cartItemId: number, quantity: number) => {
        try {
            const csrfToken = getCsrfToken();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };

            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            const body: any = {
                quantity: quantity,
            };

            // Add CSRF token to body as well
            if (csrfToken) {
                body._token = csrfToken;
            }

            const response = await fetch(`/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }

            await fetchCart();
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            const csrfToken = getCsrfToken();
            const headers: HeadersInit = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };

            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            const response = await fetch(`/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to remove from cart');
            }

            await fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                total,
                loading,
                fetchCart,
                addToCart,
                updateCartItem,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

