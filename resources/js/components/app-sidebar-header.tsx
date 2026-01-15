import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useCart } from '@/contexts/cart-context';
import { Badge } from '@/components/ui/badge';
import { Link, usePage } from '@inertiajs/react';
import { listcommand, notifications } from '@/routes';
import { type SharedData } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { cartCount } = useCart();
    const { auth } = usePage<SharedData>().props;
    const [notificationCount, setNotificationCount] = useState(0);
    const isAdmin = auth.user?.role?.slug === 'admin';

    useEffect(() => {
        if (isAdmin) {
            const fetchNotificationCount = async () => {
                try {
                    const response = await fetch('/api/notifications', {
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setNotificationCount(data.unread_count || 0);
                    }
                } catch (error) {
                    console.error('Error fetching notification count:', error);
                }
            };

            fetchNotificationCount();
            // Refresh every 30 seconds
            const interval = setInterval(fetchNotificationCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isAdmin]);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                {isAdmin && (
                    <Button variant="ghost" size="icon" className="h-9 w-9 relative cursor-pointer" asChild>
                        <Link href={notifications().url}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 hover:opacity-100">
                                <path fill="none" d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                            </svg>
                            {notificationCount > 0 && (
                                <Badge 
                                    variant="destructive" 
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    {notificationCount > 99 ? '99+' : notificationCount}
                                </Badge>
                            )}
                        </Link>
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="h-9 w-9 relative cursor-pointer" asChild>
                    <Link href={listcommand().url}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 hover:opacity-100">
                            <circle cx="8" cy="21" r="1"/>
                            <circle cx="19" cy="21" r="1"/>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                        {cartCount > 0 && (
                            <Badge 
                                variant="destructive" 
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            >
                                {cartCount > 99 ? '99+' : cartCount}
                            </Badge>
                        )}
                    </Link>
                </Button>
            </div>
        </header>
    );
}
