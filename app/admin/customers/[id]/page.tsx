import { getCustomer } from '../actions';
import { notFound } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await getCustomer(id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Customer Details</h1>
                <Button asChild variant="outline">
                    <Link href="/admin/customers">Back to Customers</Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Name:</span>
                            <span>{customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Role:</span>
                            <span>{customer.role}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">User ID:</span>
                            <span className="text-muted-foreground text-sm">{customer.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Joined:</span>
                            <span>{formatDate(customer.createdAt)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Total Orders:</span>
                            <span>{customer.orders.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Total Spent:</span>
                            <span>
                                {formatCurrency(
                                    customer.orders.reduce((acc, order) => acc + order.total, 0)
                                )}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Order History</h2>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        {order.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.items.length} items</TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(order.total)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                View Order
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {customer.orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
