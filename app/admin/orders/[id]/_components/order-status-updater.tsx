'use client';

import { updateOrderStatus } from '@/actions/admin-order';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useTransition } from 'react';

interface OrderStatusUpdaterProps {
    orderId: string;
    currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        startTransition(async () => {
            await updateOrderStatus(orderId, newStatus);
        });
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select
                disabled={isPending}
                value={status}
                onValueChange={handleStatusChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
