import { ProductSection } from '@/components/customer/ProductSection';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export const metadata = {
    title: 'Products | Cloudinary Next',
    description: 'Browse our collection of products',
};

export default async function ProductsPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

    return (
        <div className="py-8">
            <ProductSection categorySlug={category} page={page} search={search} />
        </div>
    );
}
