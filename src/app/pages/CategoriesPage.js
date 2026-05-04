import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../../services/api';
import { Loader2 } from 'lucide-react';

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      
      // Get product count for each category
      const products = await getProducts();
      const categoriesWithCount = data.map(category => ({
        ...category,
        productCount: products.filter(p => p.category?.categoryId === category.categoryId).length
      }));
      
      setCategories(categoriesWithCount);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const gradients = [
    'from-blue-500 to-blue-600',
    'from-red-500 to-red-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-gray-600 text-lg">
          Browse our collection of premium fitness equipment by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(categories) && categories.map((category, index) => (
          <Link 
            key={category.categoryId} 
            to={`/products?category=${category.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className={`h-48 bg-gradient-to-br ${gradients[index % gradients.length]}`}></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <p className="text-sm text-gray-500">
                  {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
