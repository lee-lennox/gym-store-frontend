// Seed script to add initial categories to the database
// Run this with: node seed-categories.js

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || process.env.REACT_APP_API_URL || 'https://gymstore-5ni9.onrender.com/api';

// You'll need to login as admin first to get the JWT token
// Replace this with your actual admin token after logging in
const ADMIN_TOKEN = 'YOUR_ADMIN_JWT_TOKEN_HERE';

const categories = [
  {
    name: 'Weights',
    slug: 'weights',
    description: 'Free weights, dumbbells, and weight training equipment'
  },
  {
    name: 'Cardio',
    slug: 'cardio',
    description: 'Cardio equipment including treadmills, bikes, and rowing machines'
  },
  {
    name: 'Equipment',
    slug: 'equipment',
    description: 'Strength training machines and gym equipment'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Gym accessories, mats, bands, and other fitness gear'
  }
];

async function seedCategories() {
  console.log('Starting category seeding...\n');

  for (const category of categories) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/categories`,
        category,
        {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`✓ Created: ${category.name} (ID: ${response.data.categoryId})`);
    } catch (error) {
      if (error.response) {
        console.error(`✗ Failed to create ${category.name}: ${error.response.data.message || error.response.statusText}`);
      } else {
        console.error(`✗ Failed to create ${category.name}: ${error.message}`);
      }
    }
  }

  console.log('\nCategory seeding completed!');
}

// Check if token is set
if (ADMIN_TOKEN === 'YOUR_ADMIN_JWT_TOKEN_HERE') {
  console.error('ERROR: Please set your admin JWT token in the script first.\n');
  console.log('To get your token:');
  console.log('1. Start your Spring Boot backend');
  console.log('2. Login as admin through the frontend or use the /api/auth/login endpoint');
  console.log('3. Copy the JWT token from localStorage or the API response');
  console.log('4. Replace ADMIN_TOKEN in this script with your token');
  console.log('5. Run: node seed-categories.js\n');
  process.exit(1);
}

seedCategories();
