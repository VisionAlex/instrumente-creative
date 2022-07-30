export interface Product {
    id: string;
    title: string;
    formattedPrice: string;
    formattedOptions?: string;
    image: string;
    slug: string;
    defaultVariantId: string;
}
