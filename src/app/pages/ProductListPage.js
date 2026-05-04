import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, searchProducts } from '../../services/api';
import { ProductCard } from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

export function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const categoryLabels = {
    'all': 'All Products',
    'free-weights': 'Weights',
    'cardio-equipment': 'Cardio',
    'strength-training': 'Equipment',
    'accessories': 'Accessories'
  };

  useEffect(() => {
    loadCategories();
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      loadProducts();
    }
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const data = await searchProducts(query);
      setProducts(data);
    } catch (err) {
      console.error('Error searching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category?.slug === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Gym Equipment</h1>
      {searchQuery && (
        <p className="text-gray-600 mb-8">
          Search results for: <span className="font-semibold">{searchQuery}</span>
        </p>
      )}

      {/* Category Dropdown */}
      <div className="mb-8 max-w-xs">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
        >
          <option value="all">All Products</option>
          {Array.isArray(categories) && categories.map((category) => (
            <option key={category.categoryId} value={category.slug}>
              {categoryLabels[category.slug] || category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}