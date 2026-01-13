import { useState } from 'react'

import { HeartIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from '@/components/ui/card'

import { cn } from '@/lib/utils'

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    size: string | null;
    color: string | null;
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
                <Button
                    size='icon'
                    onClick={() => setLiked(!liked)}
                    variant='ghost'
                    className='absolute right-2 top-2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background'
                >
                    <HeartIcon className={cn('h-4 w-4', liked ? 'fill-destructive stroke-destructive text-destructive' : '')} />
                    <span className='sr-only'>Like</span>
                </Button>
            </div>
            <CardHeader className='pb-3'>
                <CardTitle className='line-clamp-1'>{product.name}</CardTitle>
                <CardDescription className='flex flex-wrap items-center gap-2'>
                    {product.size && (
                        <Badge variant='outline' className='text-xs'>
                            {product.size}
                        </Badge>
                    )}
                    {product.color && (
                        <Badge variant='outline' className='text-xs'>
                            {product.color}
                        </Badge>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className='pb-3'>
                <p className='line-clamp-2 text-sm text-muted-foreground'>{product.description}</p>
            </CardContent>
            <CardFooter className='flex items-center justify-between gap-3 pt-3'>
                <div className='flex flex-col'>
                    <span className='text-xs font-medium uppercase text-muted-foreground'>Price</span>
                    <span className='text-xl font-bold'>${Number(product.price).toFixed(2)}</span>
                </div>
                <Button size='lg' className='shrink-0'>
                    Add to cart
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CardProduct

