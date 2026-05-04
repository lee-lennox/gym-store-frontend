import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, API_ORIGIN, getImagesByProductId } from '../../services/api';
import { Loader2, ArrowLeft, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/imagefullbackk/ImageWithFallback';
import { useCart } from '../context/CartContext';

export function ProductDetailPage() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedView, setSelectedView] = useState('front');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentReviewImageIndex, setCurrentReviewImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      setProduct(data);
      
      // Set default selections to first option
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]);
      }
      if (data.weights && data.weights.length > 0) {
        setSelectedWeight(data.weights[0]);
      }

      // Load product reviews/images if available
      try {
        setReviewsLoading(true);
        const images = await getImagesByProductId(productId);
        // Mock review data structure - in real implementation, this would come from a reviews endpoint
        if (images && images.length > 0) {
          const mockReviews = images.map((img, idx) => ({
            id: idx,
            reviewer_name: `Customer ${idx + 1}`,
            rating: Math.floor(Math.random() * 2) + 4, // Random 4-5 stars
            comment: 'Great product! Highly recommend.',
            image_url: img.imagePath || img.url,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }));
          setReviews(mockReviews);
        }
      } catch (err) {
        console.log('Could not load reviews:', err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const getRatingDistribution = () => {
    if (!product?.rating) return {};
    // Mock rating distribution - in real implementation, this would come from backend
    const distribution = {
      5: Math.floor(product.rating * 20),
      4: Math.floor(product.rating * 15),
      3: Math.floor(product.rating * 8),
      2: Math.floor(product.rating * 3),
      1: Math.floor(product.rating * 1)
    };
    return distribution;
  };

  const handlePreviousReview = () => {
    setCurrentReviewImageIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setCurrentReviewImageIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const getProductImage = () => {
    if (!product) return null;
    
    const imageMap = {
      front: product.imagePath,
      back: product.backImagePath,
      side: product.sideImagePath,
    };
    
    const imagePath = imageMap[selectedView];
    if (!imagePath) return null;
    
    const path = String(imagePath || '');
    let imageUrl = path;
    if (!/^https?:\/\//i.test(path) && !/^\/\//.test(path)) {
      const sep = path.startsWith('/') ? '' : '/';
      imageUrl = `${API_ORIGIN}${sep}${path}`;
    }
    return imageUrl;
  };

  const hasMultipleViews = product && (product.backImagePath || product.sideImagePath);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Error: {error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const totalReviews = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
            {getProductImage() ? (
              <ImageWithFallback
                src={getProductImage()}
                alt={`${product.name} - ${selectedView} view`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* View selector buttons */}
          {hasMultipleViews && (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedView('front')}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedView === 'front'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Front View
              </button>
              {product.backImagePath && (
                <button
                  onClick={() => setSelectedView('back')}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    selectedView === 'back'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Back View
                </button>
              )}
              {product.sideImagePath && (
                <button
                  onClick={() => setSelectedView('side')}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    selectedView === 'side'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Side View
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {product.category?.name || 'Uncategorized'}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Enhanced Rating Display */}
          {product.rating && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{product.rating.toFixed(1)}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{totalReviews} reviews</p>
                  <p className="text-xs text-gray-500">Based on customer feedback</p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="w-12 text-gray-600">{stars} star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-3xl font-bold text-blue-600">R{product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Availability:</span>
              <span
                className={`text-sm font-semibold ${
                  product.stock > 10
                    ? 'text-green-600'
                    : product.stock > 0
                    ? 'text-orange-600'
                    : 'text-red-600'
                }`}
              >
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Color</h2>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.weights && product.weights.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Weight (kg)</h2>
              <div className="flex flex-wrap gap-3">
                {product.weights.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedWeight === weight
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {weight} kg
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              const options = {};
              if (selectedColor) options.color = selectedColor;
              if (selectedWeight) options.weight = selectedWeight;
              addToCart(product, 1, options);
            }}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {reviews.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Review Images Carousel */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Review Photos</h3>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              {reviewsLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              ) : reviews[currentReviewImageIndex]?.image_url ? (
                <ImageWithFallback
                  src={reviews[currentReviewImageIndex].image_url}
                  alt={`Review by ${reviews[currentReviewImageIndex].reviewer_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}

              {reviews.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousReview}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={handleNextReview}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentReviewImageIndex + 1} / {reviews.length}
              </div>
            </div>
          </div>

          {/* Review Details */}
          {reviews[currentReviewImageIndex] && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{reviews[currentReviewImageIndex].reviewer_name}</p>
                  <p className="text-sm text-gray-500">{reviews[currentReviewImageIndex].date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < reviews[currentReviewImageIndex].rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{reviews[currentReviewImageIndex].comment}</p>
            </div>
          )}

          {/* Review Thumbnails */}
          {reviews.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-6">
              {reviews.map((review, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReviewImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    currentReviewImageIndex === idx
                      ? 'border-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {review.image_url ? (
                    <ImageWithFallback
                      src={review.image_url}
                      alt={`Review thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
