import { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toast = useToast();
  // product: product object
  // quantity: number
  // options: object e.g. { color: 'red', weight: '2kg' }
  const addToCart = (product, quantity = 1, options = {}) => {
    // Check stock availability
    if (!product.stock || product.stock <= 0) {
      toast.error(`${product.name} is out of stock!`);
      return;
    }

    const optionsKey = JSON.stringify(options || {});
    const itemKey = `${product.productId}::${optionsKey}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.key === itemKey);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        // Check if new quantity exceeds stock
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock!`);
          return prevCart;
        }

        return prevCart.map((item) =>
          item.key === itemKey
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      // Check stock for new item
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock!`);
        return prevCart;
      }

      return [...prevCart, { key: itemKey, product, quantity, options }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (itemKey) => {
    setCart((prevCart) => prevCart.filter((item) => item.key !== itemKey));
  };

  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.key === itemKey) {
          // Check stock limit
          if (quantity > item.product.stock) {
            toast.error(`Only ${item.product.stock} items available in stock!`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
