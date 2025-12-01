import { AdminProvider } from "@/components/admin/AdminContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                <AdminSidebar />

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
