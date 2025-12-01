import { getOrders } from '@/actions/admin-order';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OrdersTableToolbar } from './_components/orders-table-toolbar';
import { OrdersPagination } from './_components/orders-pagination';

interface OrdersAdminPageProps {
    searchParams: Promise<{
        query?: string;
        status?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function OrdersAdminPage({ searchParams }: OrdersAdminPageProps) {
    const params = await searchParams;
    const query = params.query;
    const status = params.status;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const { orders, pagination, error } = await getOrders({ query, status, page, limit });

    if (error || !orders) {
        return (
            <div className="p-4 text-red-500">
                Error loading orders: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Orders</h1>
            </div>

            <div className="space-y-4">
                <OrdersTableToolbar />

                <div className="rounded-md border bg-card">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Items</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium truncate max-w-[100px]" title={order.id}>
                                                {order.id.substring(0, 8)}...
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{order.user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{order.user.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">{order._count.items} items</td>
                                            <td className="p-4 align-middle">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'PAID' ? 'bg-yellow-100 text-yellow-800' :
                                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pagination && (
                    <OrdersPagination
                        total={pagination.total}
                        pages={pagination.pages}
                        page={pagination.page}
                        limit={pagination.limit}
                    />
                )}
            </div>
        </div>
    );
}