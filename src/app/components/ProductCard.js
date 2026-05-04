import { Link } from 'react-router-dom';
import { ShoppingCart, Pencil, Star } from 'lucide-react';
import { ImageWithFallback } from './imagefullbackk/ImageWithFallback';
import { API_ORIGIN } from '../../services/api';
import { useCart } from '../context/CartContext';

export function ProductCard({ product, showAdminActions = false }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.productId}`}>
        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
          {product.imagePath ? (
            (() => {
              // Ensure there's exactly one slash between API_ORIGIN and imagePath
              const path = String(product.imagePath || '');
              // If imagePath is already an absolute URL, use it as-is
              let imageUrl = path;
              if (!/^https?:\/\//i.test(path) && !/^\/\//.test(path)) {
                const sep = path.startsWith('/') ? '' : '/';
                imageUrl = `${API_ORIGIN}${sep}${path}`;
              }
              return (
                <ImageWithFallback
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              );
            })()
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.productId}`}>
          <h3 className="font-semibold mb-1 hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">Colors: {product.colors.join(', ')}</p>
          </div>
        )}

        {product.weights && product.weights.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500">Weights: {product.weights.join(', ')}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xl font-bold text-black">R{product.price.toFixed(2)}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
              {product.stock !== undefined && (
                <p className={`text-xs font-medium ${
                  product.stock === 0 ? 'text-red-600' : 
                  product.stock < 10 ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  • {product.stock} in stock
                </p>
              )}
            </div>
          </div>

          {showAdminActions ? (
            <Link
              to={`/admin/product/${product.productId}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              aria-label="Edit product"
            >
              <Pencil className="h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}