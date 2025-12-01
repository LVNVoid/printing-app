import { ProductSection } from '@/components/customer/ProductSection';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const HomePage = async (props: {
  searchParams: SearchParams
}) => {
  const searchParams = await props.searchParams
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined

  return (
    <div className="py-8">
      <ProductSection categorySlug={category} />
    </div>
  );
};

export default HomePage;
