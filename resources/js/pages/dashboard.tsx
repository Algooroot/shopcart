import CardProductDemo from '@/components/card-product-demo';
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

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <Head title="Dashboard" /> */}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Featured Products</CardTitle>
                            <CardDescription>Discover our latest products</CardDescription>
                        </CardHeader>
                    </Card>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <CardProductDemo />
                        <CardProductDemo />
                        <CardProductDemo />
                        <CardProductDemo />
                        <CardProductDemo />
                        <CardProductDemo />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
