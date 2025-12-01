'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { Menu, Printer, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSession, signOut } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCart } from '@/components/customer/CartContext';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const { cartCount, setIsOpen: setCartOpen } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center gap-4 md:gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Printer className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight hidden md:block">PrintMaster</span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl mx-auto hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search for products..."
                            className="w-full bg-secondary/50 pl-9 focus-visible:bg-background"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <ModeToggle />

                    <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>

                    <div className="hidden md:flex items-center gap-2">
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <User className="h-5 w-5" />
                                        <span className="sr-only">User menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders">My Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <div className="flex flex-col gap-6 mt-6">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search products..."
                                            className="w-full pl-9"
                                        />
                                    </div>
                                    <nav className="flex flex-col gap-4">
                                        <Link
                                            href="/"
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium hover:text-primary"
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            href="/products"
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium hover:text-primary"
                                        >
                                            Products
                                        </Link>
                                        {session && (
                                            <Link
                                                href="/orders"
                                                onClick={() => setIsOpen(false)}
                                                className="text-lg font-medium hover:text-primary"
                                            >
                                                My Orders
                                            </Link>
                                        )}
                                    </nav>
                                    <div className="flex flex-col gap-2">
                                        {session ? (
                                            <Button variant="outline" className="w-full" onClick={() => signOut()}>
                                                Log out
                                            </Button>
                                        ) : (
                                            <>
                                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                                    <Button variant="outline" className="w-full">
                                                        Log in
                                                    </Button>
                                                </Link>
                                                <Link href="/register" onClick={() => setIsOpen(false)}>
                                                    <Button className="w-full">Sign Up</Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
