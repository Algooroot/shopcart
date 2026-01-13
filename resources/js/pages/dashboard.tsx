import CardProduct from '@/components/card-product';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    size: string | null;
    color: string | null;
    is_active: boolean;
    stock: number;
    created_at: string;
    updated_at: string;
}

interface DashboardProps {
    products: Product[];
}

export default function Dashboard({ products }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Featured Products</CardTitle>
                            <CardDescription>Discover our latest products</CardDescription>
                        </CardHeader>
                    </Card>
                    {products.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <CardProduct key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                No products available at the moment.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
