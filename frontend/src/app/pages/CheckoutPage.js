import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/imagefullbackk/ImageWithFallback';
import { ShoppingCart, MapPin, CreditCard, Package, ArrowLeft, CheckCircle, Lock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { createOrder, createOrderItem, createPayment, createAddress, API_ORIGIN } from '../../services/api';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      // Redirect to sign in page if not logged in
      navigate('/signin', { state: { from: '/checkout' } });
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);
  
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'South Africa',
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 150 : 0;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products before proceeding to checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePreviousProduct = () => {
    setCurrentProductIndex((prev) => (prev === 0 ? cart.length - 1 : prev - 1));
  };

  const handleNextProduct = () => {
    setCurrentProductIndex((prev) => (prev === cart.length - 1 ? 0 : prev + 1));
  };

  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    const path = String(imagePath || '');
    // If imagePath is already an absolute URL, use it as-is
    let imageUrl = path;
    if (!/^https?:\/\//i.test(path) && !/^\/\//.test(path)) {
      const sep = path.startsWith('/') ? '' : '/';
      imageUrl = `${API_ORIGIN}${sep}${path}`;
    }
    console.log('Image URL:', imageUrl, 'API_ORIGIN:', API_ORIGIN, 'imagePath:', imagePath);
    return imageUrl;
  };

  const handleFinalSubmit = async () => {
    if (!user?.userId) {
      toast.error('Please sign in to complete your order');
      navigate('/signin', { state: { from: '/checkout' } });
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Create shipping address first
      const addressData = {
        user: {
          userId: user.userId
        },
        line1: shippingData.line1,
        line2: shippingData.line2 || null,
        city: shippingData.city,
        state: shippingData.state,
        postalCode: shippingData.postalCode,
        country: shippingData.country,
        type: 'SHIPPING'
      };

      const createdAddress = await createAddress(addressData);

      // Step 2: Create order with address reference
      const orderData = {
        user: {
          userId: user.userId
        },
        totalAmount: total,
        status: 'PENDING',
        shippingAddress: {
          addressId: createdAddress.addressId
        },
        orderDate: new Date().toISOString()
      };

      const createdOrder = await createOrder(orderData);
      
      // Create order items with new backend format
      const orderItemPromises = cart.map(item => {
        return createOrderItem({
          orderId: createdOrder.orderId,
          productId: item.product.productId,
          quantity: item.quantity,
          price: item.product.price
        });
      });

      await Promise.all(orderItemPromises);

      // Stock is automatically decreased by backend when creating order items

      // Create payment record
      await createPayment({
        orderId: createdOrder.orderId,
        amount: total,
        provider: paymentData.paymentMethod.toUpperCase(),
        status: 'COMPLETED'
      });

      // Clear cart after successful order
      clearCart();
      
      toast.success('Order placed successfully!');
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: `FG${createdOrder.orderId}`,
          total, 
          email: shippingData.email,
          items: cart,
          orderId: createdOrder.orderId
        } 
      });
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, name: 'Shipping', icon: MapPin },
    { number: 2, name: 'Payment', icon: CreditCard },
    { number: 3, name: 'Review', icon: Package },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cart
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.number
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-sm mt-2 font-medium">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 transition-colors ${
                    currentStep > step.number ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={shippingData.line1}
                      onChange={(e) => setShippingData({ ...shippingData, line1: e.target.value })}
                      required
                      placeholder="Street address, P.O. box, company name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shippingData.line2}
                      onChange={(e) => setShippingData({ ...shippingData, line2: e.target.value })}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province *
                      </label>
                      <select
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Province</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="Northern Cape">Northern Cape</option>
                        <option value="North West">North West</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                </div>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentData.paymentMethod === 'card'}
                          onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                          className="mr-2"
                        />
                        Credit/Debit Card
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="eft"
                          checked={paymentData.paymentMethod === 'eft'}
                          onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                          className="mr-2"
                        />
                        EFT (Bank Transfer)
                      </label>
                    </div>
                  </div>
                  {paymentData.paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cardName}
                          onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={paymentData.expiryDate}
                            onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                            placeholder="MM/YY"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                            placeholder="123"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Review Your Order</h2>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </h3>
                    <button onClick={() => setCurrentStep(1)} className="text-sm text-blue-600 hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p className="font-medium">{shippingData.fullName}</p>
                    <p>{shippingData.line1}</p>
                    {shippingData.line2 && <p>{shippingData.line2}</p>}
                    <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
                    <p>{shippingData.country}</p>
                    <p className="mt-2">{shippingData.email}</p>
                    <p>{shippingData.phone}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </h3>
                    <button onClick={() => setCurrentStep(2)} className="text-sm text-blue-600 hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p className="font-medium">
                      {paymentData.paymentMethod === 'card' ? 'Credit/Debit Card' : 'EFT (Bank Transfer)'}
                    </p>
                    {paymentData.paymentMethod === 'card' && (
                      <>
                        <p>•••• •••• •••• {paymentData.cardNumber.slice(-4)}</p>
                        <p>{paymentData.cardName}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Order Items - Carousel */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  
                  {cart.length === 1 ? (
                    // Single item - show normally without carousel
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.product.productId} className="bg-gray-50 p-6 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Product Image - Large */}
                            <div className="flex items-center justify-center">
                              <div className="w-40 h-40 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-md border border-gray-200">
                                {item.product.imagePath ? (
                                  <ImageWithFallback
                                    src={getProductImageUrl(item.product.imagePath)}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                                    No Image
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Product Details */}
                            <div className="md:col-span-2">
                              <p className="font-bold text-lg mb-3">{item.product.name}</p>
                              
                              <div className="space-y-2 mb-4">
                                {item.options?.color && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-gray-700">Color:</span>
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                      {item.options.color}
                                    </span>
                                  </div>
                                )}
                                {item.options?.weight && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-gray-700">Weight:</span>
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                      {item.options.weight}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                  <p className="font-bold text-lg">{item.quantity}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Price Each</p>
                                  <p className="font-semibold">R{item.product.price.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                                  <p className="font-bold text-lg text-blue-600">R{(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Multiple items - show as carousel
                    <div>
                      <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-6 mb-4 relative">
                        {/* Carousel Item */}
                        <div className="flex gap-4 items-center">
                          <div className="w-32 h-32 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                            {cart[currentProductIndex]?.product.imagePath ? (
                              <ImageWithFallback
                                src={getProductImageUrl(cart[currentProductIndex].product.imagePath)}
                                alt={cart[currentProductIndex].product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-xs text-blue-600 font-semibold mb-1">Item {currentProductIndex + 1} of {cart.length}</p>
                            <p className="font-bold text-lg mb-2">{cart[currentProductIndex]?.product.name}</p>
                            
                            {cart[currentProductIndex]?.options?.color && (
                              <div className="mb-2">
                                <p className="text-xs text-gray-600">
                                  <span className="font-semibold">Color:</span> 
                                  <span className="ml-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {cart[currentProductIndex].options.color}
                                  </span>
                                </p>
                              </div>
                            )}
                            
                            {cart[currentProductIndex]?.options?.weight && (
                              <div className="mb-2">
                                <p className="text-xs text-gray-600">
                                  <span className="font-semibold">Weight:</span>
                                  <span className="ml-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    {cart[currentProductIndex].options.weight}
                                  </span>
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-3 flex gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Quantity</p>
                                <p className="font-semibold text-lg">{cart[currentProductIndex]?.quantity}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Price Each</p>
                                <p className="font-semibold text-lg">R{cart[currentProductIndex]?.product.price.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Subtotal</p>
                                <p className="font-bold text-lg text-blue-600">R{(cart[currentProductIndex]?.product.price * cart[currentProductIndex]?.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <button
                          onClick={handlePreviousProduct}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-md transition-colors"
                          aria-label="Previous product"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleNextProduct}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-md transition-colors"
                          aria-label="Next product"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Indicators */}
                      <div className="flex justify-center gap-2 mb-4">
                        {cart.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentProductIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentProductIndex 
                                ? 'bg-blue-600 w-6' 
                                : 'bg-gray-300 w-2 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to item ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      {/* Items Summary */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-600 mb-2">All Items Summary:</p>
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-700">
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span className="font-medium">R{(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={submitting}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="font-medium">R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">R{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT (15%)</span>
                  <span className="font-medium">R{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1 text-sm">
                <p className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Free returns within 30 days
                </p>
                <p className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  2-year warranty included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
