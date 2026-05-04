import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../../services/api';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoryLabels = {
    'all': 'All Products',
    'free-weights': 'Weights',
    'cardio-equipment': 'Cardio',
    'strength-training': 'Equipment',
    'accessories': 'Accessories'
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

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
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category?.slug === selectedCategory).slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop)',
          }}
        ></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Your Fitness Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Premium gym equipment for your home and professional training. Start building your dream gym today.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-black transition-colors"
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Equipment</h2>
            <p className="text-gray-600 text-lg">
              Explore our top-rated gym equipment
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              All Products
            </button>
            {Array.isArray(categories) && categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {categoryLabels[category.slug] || category.name}
              </button>
            ))}
          </div>
          
          {filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
