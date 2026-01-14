import { useState } from 'react'

import { HeartIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card'

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
                <Button size='lg' className='shrink-0' disabled={product.stock === 0}>
                    {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CardProduct

