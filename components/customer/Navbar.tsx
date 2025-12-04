'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SearchInput } from './SearchInput';
import { ModeToggle } from '@/components/mode-toggle';
import { Menu, Printer, Search, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
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

export function Navbar({ storeName }: { storeName?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const { data: session } = useSession();
    const { cartCount, setIsOpen: setCartOpen, clearCart } = useCart();
    const pathname = usePathname();


    const handleLogout = () => {
        clearCart();
        signOut();
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
                        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Printer className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <span className="text-base sm:text-xl font-bold tracking-tight hidden xs:inline">
                            PrintMaster
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 mx-6">
                        <Link
                            href="/"
                            className={`text-sm font-semibold transition-colors hover:text-primary ${pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className={`text-sm font-semibold transition-colors hover:text-primary ${pathname?.startsWith('/products') ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                        >
                            Products
                        </Link>
                        {session && (
                            <Link
                                href="/orders"
                                className={`text-sm font-semibold transition-colors hover:text-primary ${pathname?.startsWith('/orders') ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                            >
                                My Orders
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Search Bar */}
                    <div className="flex-1 max-w-md mx-auto hidden lg:block">
                        <SearchInput />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="sr-only">Search</span>
                        </Button>

                        {/* Theme Toggle */}
                        <div className="hidden sm:block">
                            <ModeToggle />
                        </div>

                        {/* Cart Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => setCartOpen(true)}
                        >
                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-[9px] sm:text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>

                        {/* Desktop User Menu */}
                        <div className="hidden md:flex items-center gap-2">
                            {!mounted ? (
                                <div className="w-20 h-10" />
                            ) : session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <User className="h-5 w-5" />
                                            <span className="sr-only">User menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel className="truncate">
                                            {session.user.name}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {session.user.role === 'ADMIN' && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/dashboard">Admin Dashboard</Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/orders">My Orders</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout}>
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">Log in</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <div className="flex md:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                                        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                                    <div className="flex flex-col gap-6 mt-6 mx-4">
                                        {/* Mobile User Info */}
                                        {mounted && session && (
                                            <div className="flex items-center gap-3 pb-4 border-b">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {session.user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {session.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation Links */}
                                        <nav className="flex flex-col gap-3">
                                            <Link
                                                href="/"
                                                onClick={() => setIsOpen(false)}
                                                className={`text-base font-medium hover:text-primary transition-colors py-2 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
                                            >
                                                Home
                                            </Link>
                                            <Link
                                                href="/products"
                                                onClick={() => setIsOpen(false)}
                                                className={`text-base font-medium hover:text-primary transition-colors py-2 ${pathname?.startsWith('/products') ? 'text-primary' : 'text-muted-foreground'}`}
                                            >
                                                Products
                                            </Link>
                                            {mounted && session && (
                                                <>
                                                    {session.user.role === 'ADMIN' && (
                                                        <Link
                                                            href="/admin/dashboard"
                                                            onClick={() => setIsOpen(false)}
                                                            className={`text-base font-medium hover:text-primary transition-colors py-2 ${pathname?.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}
                                                        >
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href="/orders"
                                                        onClick={() => setIsOpen(false)}
                                                        className={`text-base font-medium hover:text-primary transition-colors py-2 ${pathname?.startsWith('/orders') ? 'text-primary' : 'text-muted-foreground'}`}
                                                    >
                                                        My Orders
                                                    </Link>
                                                </>
                                            )}
                                        </nav>

                                        {/* Theme Toggle for Mobile */}
                                        <div className="flex items-center justify-between py-2 border-t">
                                            <span className="text-sm font-medium">Theme</span>
                                            <ModeToggle />
                                        </div>

                                        {/* Auth Buttons */}
                                        {mounted && (
                                            <div className="flex flex-col gap-2 pt-4 border-t">
                                                {session ? (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={() => {
                                                            handleLogout();
                                                            setIsOpen(false);
                                                        }}
                                                    >
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
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar (Collapsible) */}
                {showSearch && (
                    <div className="lg:hidden pb-3 pt-2 animate-in slide-in-from-top-2">
                        <SearchInput autoFocus />
                    </div>
                )}
            </div>
        </header>
    );
}