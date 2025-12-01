'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from './CartContext';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CartSheet() {
    const { items, removeItem, updateQuantity, cartTotal, isOpen, setIsOpen } = useCart();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
                </SheetHeader>
                {items.length > 0 ? (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="flex flex-col gap-4 py-4">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4">
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
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between gap-2">
                                                <h3 className="font-medium line-clamp-2">
                                                    {item.product.name}
                                                </h3>
                                                <p className="font-bold shrink-0">
                                                    {new Intl.NumberFormat('id-ID', {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                    }).format(item.product.price * item.quantity)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            updateQuantity(item.product.id, item.quantity - 1)
                                                        }
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            updateQuantity(item.product.id, item.quantity + 1)
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="space-y-4 pr-6">
                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-base font-medium">Total</span>
                                <span className="text-xl font-bold">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }).format(cartTotal)}
                                </span>
                            </div>
                            <SheetFooter>
                                <Button className="w-full" size="lg" asChild>
                                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                                        Checkout
                                    </Link>
                                </Button>
                            </SheetFooter>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-2">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-muted-foreground">
                            Your cart is empty
                        </span>
                        <Button variant="link" asChild onClick={() => setIsOpen(false)}>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
