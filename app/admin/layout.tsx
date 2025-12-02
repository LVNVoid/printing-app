import { AdminProvider } from "@/components/admin/AdminContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

import { getStoreSettings } from '@/app/admin/settings/actions';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getStoreSettings();
    const storeName = settings?.storeName;

    return (
        <AdminProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                <AdminSidebar storeName={storeName} />

                <div className="flex flex-1 flex-col overflow-hidden">
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto bg-muted/20 p-4 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}
