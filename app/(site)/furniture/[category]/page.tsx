import { ProductCard } from "@/components/furniture/ProductCard";
import { mockProducts } from "@/lib/mock-data";

export default function FurnitureCategoryPage({ params }: { params: { category: string } }) {
  const products = mockProducts.filter((item) => item.categorySlug === params.category);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-light capitalize text-primary">{params.category}</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={{
              id: item.id,
              name: item.name,
              slug: item.slug,
              category: item.category,
              image: item.image,
              price: item.price,
              discount: item.discount
            }}
          />
        ))}
      </div>
    </main>
  );
}
