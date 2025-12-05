
export interface ProductListItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number; 
    pictures: {
        id: string;
        imageUrl: string | null;
    }[];
    category: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

export interface CartProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    description?: string | null;
    pictures: {
        id: string;
        imageUrl: string | null;
    }[];
}

export interface CategoryItem {
    id: string;
    name: string;
    slug: string;
}

