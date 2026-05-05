import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './imagefullbackk/ImageWithFallback';
import { API_ORIGIN } from '../../services/api';

export function CartSidebar() {
  const navigate = useNavigate();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const path = String(imagePath || '');
    let imageUrl = path;
    if (!/^https?:\/\//i.test(path) && !/^\/\//.test(path)) {
      const sep = path.startsWith('/') ? '' : '/';
      imageUrl = `${API_ORIGIN}${sep}${path}`;
    }
    return imageUrl;
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Cart</h2>
              <p className="text-xs text-gray-500">{getCartCount()} item{getCartCount() !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Package className="h-10 w-10 text-gray-600" />
              </div>
              <p className="text-white font-semibold text-lg mb-1">Your cart is empty</p>
              <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/products');
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-500 hover:to-gray-400 transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const imageUrl = getProductImageUrl(item.product.imagePath);
                return (
                  <div 
                    key={item.key} 
                    className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="w-20 h-20 bg-black/20 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                      {imageUrl ? (
                        <ImageWithFallback
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black/20">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      
                      {Object.keys(item.options || {}).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(item.options).map(([key, val]) => (
                            <span 
                              key={key}
                              className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-gray-400"
                            >
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-gray-300 font-bold text-sm mb-2">
                        R{item.product.price.toFixed(2)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 text-gray-400" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-white/5 p-5 space-y-4">
            {/* Free Shipping Progress */}
            {subtotal < 2000 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400 font-medium">
                    Add R{(2000 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                  <span className="text-xs text-gray-300 font-bold">
                    {Math.round((subtotal / 2000) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 rounded-full transition-all duration-500"
                    style={{ width: `${(subtotal / 2000) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-white">R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-white">
                  {shipping === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    `R${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-xl font-bold text-gray-300">R{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white py-4 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-400 transition-all shadow-xl shadow-gray-500/20"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-xs text-gray-600">
              Secure checkout • Free returns within 30 days
            </p>
          </div>
        )}
      </div>
    </>
  );
}