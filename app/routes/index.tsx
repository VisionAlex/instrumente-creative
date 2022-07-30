import type { LoaderFunction } from "@remix-run/node";
import { Link } from "~/components/Link";
import { Logo } from "~/components/Logo";
import { Navbar } from "~/components/Navbar";
import { createShopifyProvider } from "~/models/shopify.server";

export const loader: LoaderFunction = async () => {
  const shopify = createShopifyProvider({
    shopName: process.env.SHOP_NAME!,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN!,
  });
  const { products } = await shopify.getProducts();
  console.log("products", products);

  return { products };
};

export default function Index() {
  return (
    <div>
      <Navbar>
        <Logo />
        <ul className="flex flex-wrap items-stretch gap-[30px] text-primary">
          <Link to="/products">Produse</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">Despre noi</Link>
          <Link to="/contact">Contact</Link>
        </ul>
        <div>Toolbar</div>
      </Navbar>
      <main className="pt-[123px]"></main>
    </div>
  );
}
