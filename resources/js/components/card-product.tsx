import { useState, useEffect } from 'react'

import { HeartIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import QuantityPicker from '@/components/quantity-picker'
import { useCart } from '@/contexts/cart-context'

import { cn } from '@/lib/utils'

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
}

interface CardProductProps {
    product: Product;
}

const CardProduct = ({ product }: CardProductProps) => {
    const [liked, setLiked] = useState<boolean>(false)
    const [quantity, setQuantity] = useState<number>(1)
    const [isInCart, setIsInCart] = useState<boolean>(false)
    const [showQuantityPicker, setShowQuantityPicker] = useState<boolean>(false)
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
    const [cartItemId, setCartItemId] = useState<number | null>(null)
    const { cartItems, addToCart, updateCartItem, removeFromCart } = useCart()

    useEffect(() => {
        const existingCartItem = cartItems.find(item => item.product_id === product.id)
        if (existingCartItem) {
            setIsInCart(true)
            setCartItemId(existingCartItem.id)
            setQuantity(existingCartItem.quantity)
            setShowQuantityPicker(true)
        } else {
            setIsInCart(false)
            setCartItemId(null)
            setQuantity(1)
            setShowQuantityPicker(false)
        }
    }, [cartItems, product.id])

    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true)
            await addToCart(product.id, 1)
            setShowQuantityPicker(true)
            setIsInCart(true)
        } catch (error) {
            console.error('Error adding to cart:', error)
        } finally {
            setIsAddingToCart(false)
        }
    }

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) {
            if (cartItemId) {
                await removeFromCart(cartItemId)
                setShowQuantityPicker(false)
            }
            return
        }

        if (newQuantity > product.stock) {
            return
        }

        if (isInCart && cartItemId) {
            await updateCartItem(cartItemId, newQuantity)
        } else {
            await addToCart(product.id, newQuantity)
        }
    }

    return (
        <Card className='overflow-hidden transition-all hover:shadow-lg'>
            <div className='relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900'>
                <img
                    src={product.image_url}
                    alt={product.name}
                    className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                />
               
            </div>
            <CardHeader className='pb-3'>
                <CardTitle className='line-clamp-1'>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className='pb-3'>
                <p className='line-clamp-2 text-sm text-muted-foreground'>{product.description}</p>
                <div className='mt-2 flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>Stock:</span>
                    <span className={cn('text-xs font-medium', product.stock === 0 ? 'text-destructive' : 'text-green-600 dark:text-green-400')}>
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} available`}
                    </span>
                </div>
            </CardContent>
            <CardFooter className='flex items-center justify-between gap-3 pt-3'>
                <div className='flex flex-col'>
                    <span className='text-xs font-medium uppercase text-muted-foreground'>Price</span>
                    <span className='text-xl font-bold'>${Number(product.price).toFixed(2)}</span>
                </div>
                {product.stock > 0 ? (
                    showQuantityPicker ? (
                        <QuantityPicker
                            quantity={quantity}
                            onQuantityChange={handleQuantityChange}
                            min={0}
                            max={product.stock}
                            disabled={product.stock === 0}
                        />
                    ) : (
                        <Button 
                            size='lg' 
                            className='shrink-0 cursor-pointer' 
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Adding...
                                </>
                            ) : (
                                'Add to cart'
                            )}
                        </Button>
                    )
                ) : (
                    <Button size='lg' className='shrink-0' disabled>
                        Out of stock
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default CardProduct

