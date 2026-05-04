# Category Setup Guide

## Quick Setup - Add Categories Through Admin UI

1. **Start your Spring Boot backend** (https://gymstore-5ni9.onrender.com)

2. **Login as Admin**
   - Go to http://localhost:5173 (or your frontend URL)
   - Sign in with admin credentials

3. **Add Categories**
   - Click the Settings icon → "Categories"
   - Click "+ Add Category" button
   - Add each category:

### Category 1: Weights
- **Name**: Weights
- **Slug**: weights
- **Description**: Free weights, dumbbells, and weight training equipment

### Category 2: Cardio
- **Name**: Cardio
- **Slug**: cardio
- **Description**: Cardio equipment including treadmills, bikes, and rowing machines

### Category 3: Equipment
- **Name**: Equipment
- **Slug**: equipment
- **Description**: Strength training machines and gym equipment

### Category 4: Accessories
- **Name**: Accessories
- **Slug**: accessories
- **Description**: Gym accessories, mats, bands, and other fitness gear

---

## Alternative: Automated Seeding (Advanced)

If you want to add all categories at once programmatically:

1. **Get your admin JWT token**:
   - Login through the frontend
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Copy the value of the `token` key

2. **Update the seed script**:
   ```bash
   # Edit seed-categories.js
   # Replace ADMIN_TOKEN with your actual token
   ```

3. **Install axios** (if not already installed):
   ```bash
   npm install axios
   ```

4. **Run the seed script**:
   ```bash
   node seed-categories.js
   ```

---

## Verify Categories

After adding categories, verify they appear in:
- Admin Dashboard → Categories
- Product List Page → Category dropdown
- Product Form → Category dropdown

