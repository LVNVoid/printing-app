import { ProductSection } from '@/components/customer/ProductSection';
import { BannerSection } from '@/components/customer/BannerSection';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const HomePage = async (props: {
  searchParams: SearchParams
}) => {
  const searchParams = await props.searchParams
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined

  return (
    <div className="py-4 mx-4 lg:mx-0 lg:py-8">
      <BannerSection />
      <ProductSection categorySlug={category} />
    </div>
  );
};

export default HomePage;
