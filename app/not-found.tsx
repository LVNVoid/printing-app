import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground space-y-4 text-center px-4">
            <h1 className="text-9xl font-extrabold text-[#25D366]">404</h1>
            <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
                Page Not Found
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Halaman yang Anda cari tidak ditemukan</h2>
            <p className="text-muted-foreground max-w-md">
                Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman tersebut telah dipindahkan atau dihapus.
            </p>
            <div className="pt-4">
                <Button asChild className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                    <Link href="/">
                        Kembali ke Beranda
                    </Link>
                </Button>
            </div>
        </div>
    );
}
