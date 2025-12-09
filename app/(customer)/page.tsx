import { FeaturedProducts } from '@/components/customer/FeaturedProducts';
import { BannerSection } from '@/components/customer/BannerSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Foman Percetakan - Jasa Cetak Profesional Indonesia',
  description:
    'Foman Percetakan menawarkan layanan cetak berkualitas tinggi: offset, digital printing, dan large format printing untuk kebutuhan bisnis maupun personal.',
  alternates: {
    canonical: 'https://printing-app-ruddy.vercel.app/',
  },
  openGraph: {
    title: 'Foman Percetakan - Jasa Cetak Profesional Indonesia',
    description:
      'Percetakan modern dengan teknologi terkini. Hasil berkualitas, harga kompetitif.',
    url: 'https://printing-app-ruddy.vercel.app/',
    siteName: 'Foman Percetakan',
    images: [
      {
        url: '/og-products-foman.jpg',
        width: 1200,
        height: 630,
        alt: 'Foman Percetakan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foman Percetakan - Jasa Cetak Profesional Indonesia',
    description:
      'Percetakan modern dengan teknologi terkini. Hasil berkualitas, harga kompetitif.',
    images: ['/og-products-foman.jpg'],
  },
};
const HomePage = async () => {

  return (
    <div className="py-4 lg:py-8">
      <BannerSection />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;
