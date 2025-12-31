import { BannerSection } from '@/components/customer/BannerSection';
import { Metadata } from 'next';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { ProductSection } from '@/components/customer/ProductSection';
import { Suspense } from 'react';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';

export const metadata: Metadata = {
  title: 'Foman Percetakan - Jasa Cetak Profesional Indonesia',
  description:
    'Foman Percetakan menawarkan layanan cetak berkualitas tinggi: offset, digital printing, dan large format printing untuk kebutuhan bisnis maupun personal.',
  alternates: {
    canonical: 'https://fomanprint.vercel.app/',
  },
  openGraph: {
    title: 'Foman Percetakan - Jasa Cetak Profesional Indonesia',
    description:
      'Percetakan modern dengan teknologi terkini. Hasil berkualitas, harga kompetitif.',
    url: 'https://fomanprint.vercel.app/',
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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface HomePageProps {
  searchParams: SearchParams
}

const HomePage = async (props: HomePageProps) => {
  const searchParams = await props.searchParams
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  return (
    <div className="py-4 lg:py-8">
      <BannerSection />
      <div className="container mt-8">
        <CategoryGrid activeCategory={category} />
        <Suspense fallback={<ProductSkeleton />}>
          <ProductSection
            categorySlug={category}
            page={page}
            search={search}
            baseUrl="/"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
