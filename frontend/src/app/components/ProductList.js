import { ProductCard } from './ProductCard';

export function ProductList({ products }) {
  if (products.length === 0) {
    return (
      <div className="bg-gray-50 border rounded-lg p-8 text-center">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
