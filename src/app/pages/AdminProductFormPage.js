import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  Product,
  Category,
} from '../../services/api';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';

export function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    stock: '',
    categoryId: '',
    colors: [],
    weights: [],
  });

  useEffect(() => {
    loadCategories();
    if (isEditMode && id) {
      loadProduct(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      // If backend returns empty, use default categories
      if (!data || data.length === 0) {
        setCategories([
          { categoryId: 1, name: 'Weights', slug: 'weights' },
          { categoryId: 2, name: 'Cardio', slug: 'cardio' },
          { categoryId: 3, name: 'Equipment', slug: 'equipment' },
          { categoryId: 4, name: 'Accessories', slug: 'accessories' }
        ]);
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Use default categories on error
      setCategories([
        { categoryId: 1, name: 'Weights', slug: 'weights' },
        { categoryId: 2, name: 'Cardio', slug: 'cardio' },
        { categoryId: 3, name: 'Equipment', slug: 'equipment' },
        { categoryId: 4, name: 'Accessories', slug: 'accessories' }
      ]);
    }
  };

  const loadProduct = async (productId) => {
    try {
      setLoading(true);
      const product = await getProductById(productId);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        sku: product.sku,
        stock: product.stock.toString(),
        categoryId: (product.category?.categoryId || product.categoryId || '').toString(),
        colors: product.colors || [],
        weights: product.weights || [],
      });
      
      // Set existing image preview
      if (product.imagePath) {
        setImagePreview(product.imagePath);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('stock', formData.stock);
      
      if (formData.categoryId) {
        formDataToSend.append('categoryId', formData.categoryId);
      }

      if (formData.colors && formData.colors.length > 0) {
        formDataToSend.append('colors', JSON.stringify(formData.colors));
      }

      if (formData.weights && formData.weights.length > 0) {
        formDataToSend.append('weights', JSON.stringify(formData.weights));
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (isEditMode && id) {
        await updateProduct(parseInt(id), formDataToSend);
      } else {
        await createProduct(formDataToSend);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Products
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Create New Product'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <label className="block mb-2 font-semibold">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            rows={4}
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">
              Price (R) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="PROD-001"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">Colors (comma separated)</label>
            <input
              type="text"
              value={formData.colors.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                colors: e.target.value.split(',').map(c => c.trim()).filter(c => c)
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g., Red, Blue, Black"
            />
            {formData.colors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <span key={color} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {color}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        colors: formData.colors.filter(c => c !== color)
                      })}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold">Weights (comma separated)</label>
            <input
              type="text"
              value={formData.weights.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                weights: e.target.value.split(',').map(w => w.trim()).filter(w => w)
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g., 1kg, 2kg, 3kg"
            />
            {formData.weights.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.weights.map((weight) => (
                  <span key={weight} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {weight}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        weights: formData.weights.filter(w => w !== weight)
                      })}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Product Image</label>
          
          {imagePreview ? (
            <div className="space-y-3">
              <div className="relative w-full max-w-md">
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Plus className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">Click to upload image</span>
                <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}