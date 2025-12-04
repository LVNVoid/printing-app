import { Navbar } from '@/components/customer/Navbar';
import { Footer } from '@/components/customer/Footer';
import { CartProvider } from '@/components/customer/CartContext';
import { CartSheet } from '@/components/customer/CartSheet';

import { getStoreSettings } from '@/app/admin/settings/actions';

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getStoreSettings();
    const storeName = settings?.storeName;

    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col max-w-7xl mx-auto">
                <Navbar storeName={storeName} />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartSheet />
            </div>
        </CartProvider>
    );
}
