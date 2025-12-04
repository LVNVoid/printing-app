'use client';

import { useCart } from '@/components/customer/CartContext';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createOrder } from '@/actions/order';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/checkout');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="container py-10">Loading...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button onClick={() => router.push('/products')}>Go to Products</Button>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        if (!session?.user?.id) return;

        setIsSubmitting(true);
        try {
            const result = await createOrder({
                userId: session.user.id,
                items: items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            });

            if (result.success) {
                clearCart();
                toast.success('Order placed successfully! Redirecting to your orders...');
                router.push('/orders');
            } else {
                toast.error(result.error || 'Failed to place order');
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <div className="border rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        {items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 py-2 border-b last:border-0">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-secondary/20">
                                    {item.product.pictures[0]?.imageUrl ? (
                                        <Image
                                            src={item.product.pictures[0].imageUrl}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.quantity} x{' '}
                                        {formatCurrency(item.product.price)}
                                    </p>
                                </div>
                                <div className="font-bold">
                                    {formatCurrency(item.product.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="border rounded-lg p-6 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Total</h2>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-2xl font-bold">
                                {formatCurrency(cartTotal)}
                            </span>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Place Order'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
