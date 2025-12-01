import { Navbar } from '@/components/customer/Navbar';
import { Footer } from '@/components/customer/Footer';
import { CartProvider } from '@/components/customer/CartContext';
import { CartSheet } from '@/components/customer/CartSheet';
import { Toaster } from 'react-hot-toast';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col max-w-7xl mx-auto">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartSheet />
                <Toaster position="bottom-right" />
            </div>
        </CartProvider>
    );
}
