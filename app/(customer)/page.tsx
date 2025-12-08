import { FeaturedProducts } from '@/components/customer/FeaturedProducts';
import { BannerSection } from '@/components/customer/BannerSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Foman Percetakan menawarkan layanan cetak berkualitas tinggi dengan teknologi modern. Melayani cetak offset, digital printing, large format printing untuk semua kebutuhan bisnis dan personal Anda.',
  openGraph: {
    title: 'Foman Percetakan - Jasa Cetak Profesional Indonesia',
    description: 'Percetakan modern dengan teknologi terkini. Hasil berkualitas, harga kompetitif.',
  },
  alternates: {
    canonical: 'https://foman.co.id',
  },
}

const HomePage = async () => {

  return (
    <div className="py-4 lg:py-8">
      <BannerSection />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;
