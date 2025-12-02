import { getActiveBanners } from '@/app/admin/settings/actions';
import { BannerCarousel } from './BannerCarousel';

export async function BannerSection() {
    const banners = await getActiveBanners();

    if (banners.length === 0) return null;

    return <BannerCarousel banners={banners} />;
}
