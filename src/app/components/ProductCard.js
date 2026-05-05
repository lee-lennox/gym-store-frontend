import { Link } from 'react-router-dom';
import { ShoppingCart, Pencil, Star, Eye, Heart, Check } from 'lucide-react';
import { ImageWithFallback } from './imagefullbackk/ImageWithFallback';
import { API_ORIGIN } from '../../services/api';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export function ProductCard({ product, showAdminActions = false }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) return;
    
    setIsAdding(true);
    await addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <Link to={`/product/${product.productId}`} className="block relative">
        <div className="aspect-square relative overflow-hidden bg-black/20">
          {product.imagePath ? (
            (() => {
              const path = String(product.imagePath || '');
              let imageUrl = path;
              if (!/^https?:\/\//i.test(path) && !/^\/\//.test(path)) {
                const sep = path.startsWith('/') ? '' : '/';
                imageUrl = `${API_ORIGIN}${sep}${path}`;
              }
              return (
                <ImageWithFallback
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              );
            })()
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-2" />
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}
          
          {/* Stock Badges */}
          {isLowStock && (
            <span className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-white/30"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`} 
            />
          </button>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Quick View
            </span>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        {/* Category Badge */}
        {product.category && (
          <div className="mb-2">
            <span className="inline-block px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <Link to={`/product/${product.productId}`}>
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'fill-gray-700 text-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Product Options Preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.slice(0, 4).map((color, index) => (
                <span
                  key={index}
                  className="inline-block w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              R{product.price.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {product.sku && (
                <p className="text-xs text-zinc-500">SKU: {product.sku}</p>
              )}
              {product.stock !== undefined && !isOutOfStock && (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  In Stock
                </p>
              )}
            </div>
          </div>

          {showAdminActions ? (
            <Link
              to={`/admin/product/${product.productId}`}
              className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm"
              aria-label="Edit product"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-700'
                  : isAdding
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-zinc-200 shadow-lg'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="h-4 w-4" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}