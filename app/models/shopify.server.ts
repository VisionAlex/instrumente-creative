import gql from "gql-tag";
import type { Product } from "./types";
interface ShopifyProviderOptions {
    shopName: string;
    accessToken: string;
}
export const createShopifyProvider = ({
    shopName,
    accessToken,
}: ShopifyProviderOptions) => {
    const href = `https://${shopName}.myshopify.com/api/2022-07/graphql.json`;
    async function query(query: string, variables?: any) {
        let request = new Request(href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": accessToken,
            },
            body: JSON.stringify({ query, variables }),
        });
        return fetch(request).then((res) => res.json());
    }

    return {
        async getProducts() {
            const json = await query(getAllProductsQuery);
            const productsInfo = (json as any).data.products;
            const products: Product[] = productsInfo.edges?.map(
                ({
                    node: { id, handle, title, images, priceRange, variants },
                }: any): Product => {
                    return {
                        formattedPrice: formatPrice(priceRange.minVariantPrice),
                        id,
                        defaultVariantId: variants.edges[0].node.id,
                        image: images.edges[0].node.url,
                        slug: handle,
                        title,
                    };
                }
            );
            return {
                products,
            };
        },
    };
};

const getAllProductsQuery = gql`
    query getAllProducts {
        products(first: 20) {
            edges {
                node {
                    id
                    title
                    handle
                    priceRange {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    images(first: 1) {
                        edges {
                            node {
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                    variants(first: 1) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

function formatPrice({
    amount,
    currencyCode,
    locale = "ro-RO",
}: {
    amount: number;
    currencyCode: string;
    locale: string;
}) {
    const formatter = Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
    });
    return formatter.format(amount);
}
