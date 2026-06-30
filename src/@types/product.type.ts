export interface Product {
    id: number;
    sl: number;
    image: string;
    name: string;
    category: string;
    subCategory: string;
    priority: number;
    sku: string;
    tags: string;
    status: 'Publish' | 'Unpublish';
}