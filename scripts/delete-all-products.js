// Delete all products script
// Usage:
//   set API_BASE_URL=http://localhost:8080/api
//   set ADMIN_TOKEN=your_admin_jwt
//   node scripts/delete-all-products.js

const axios = require('axios');

const API_BASE = process.env.API_BASE_URL || process.env.REACT_APP_API_URL || 'https://gymstore-5ni9.onrender.com/api';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'YOUR_ADMIN_JWT_TOKEN_HERE';

if (!ADMIN_TOKEN || ADMIN_TOKEN === 'YOUR_ADMIN_JWT_TOKEN_HERE') {
  console.error('ERROR: set ADMIN_TOKEN environment variable to an admin JWT token.');
  process.exit(1);
}

async function fetchProducts() {
  const res = await axios.get(`${API_BASE}/products`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
  });
  return res.data || [];
}

async function deleteProduct(id) {
  await axios.delete(`${API_BASE}/products/${id}`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
  });
}

(async () => {
  try {
    console.log('Fetching products...');
    const products = await fetchProducts();
    console.log(`Found ${products.length} products.`);
    if (products.length === 0) return console.log('No products to delete.');

    for (const p of products) {
      const id = p.productId || p.id || p.product_id || p._id;
      if (!id) {
        console.warn('Skipping product with unknown id:', p);
        continue;
      }
      try {
        console.log('Deleting product id=', id, 'name=', p.name || p.title || '');
        await deleteProduct(id);
      } catch (e) {
        console.error('Failed to delete', id, e.response?.data || e.message);
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
})();
