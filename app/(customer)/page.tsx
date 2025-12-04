import { FeaturedProducts } from '@/components/customer/FeaturedProducts';
import { BannerSection } from '@/components/customer/BannerSection';

const HomePage = async () => {
  return (
    <div className="py-4 mx-4 lg:mx-0 lg:py-8">
      <BannerSection />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;
