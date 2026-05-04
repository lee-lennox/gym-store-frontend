import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './imagefullbackk/ImageWithFallback';
import { API_ORIGIN } from '../../services/api';

export function CartSidebar() {
  const navigate = useNavigate();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart ({getCartCount()})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                return (
                  <div key={item.key} className="flex gap-4 border-b pb-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imagePath ? (
                        (() => {
                          const path = String(item.product.imagePath || '');
                          let imageUrl = path;
                          if (!/^https?:\/\//i.test(path) && !/^\/\//.test(path)) {
                            const sep = path.startsWith('/') ? '' : '/';
                            imageUrl = `${API_ORIGIN}${sep}${path}`;
                          }
                          return (
                            <ImageWithFallback
                              src={imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          );
                        })()
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">{item.product.name}</h3>
                      {Object.keys(item.options || {}).length > 0 && (
                        <div className="text-xs text-gray-500 mb-1">
                          {Object.entries(item.options).map(([key, val]) => (
                            <div key={key}>
                              {key}: {val}
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-blue-600 font-bold mb-2">R{item.product.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>R{getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
