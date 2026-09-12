import { getProducts } from "@/lib/store";
import ProductForm from "./ProductForm";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-extrabold text-brand-green-900">إضافة منتج جديد</h2>
        <p className="mt-1 text-sm text-brand-green-900/60">مثال: بقرة، عجل، ماعز، خروف، كبش</p>
        <div className="mt-4">
          <ProductForm />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-brand-green-900">المنتجات الحالية ({products.length})</h2>
        <div className="mt-4 flex flex-col gap-5">
          {products.map((product) => (
            <ProductForm key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
