# Quick Setup Guide

## Step-by-Step Installation

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Generate application key
php artisan key:generate

# Configure your database in .env file
# DB_DATABASE=inventory_db
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Create database
mysql -u root -p -e "CREATE DATABASE inventory_db;"

# Run migrations
php artisan migrate

# (Optional) Seed with default user
php artisan db:seed

# Start server
php artisan serve
```

Backend runs at: **http://localhost:8000**

---

### 2. Frontend Setup (3 minutes)

```bash
# Open new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: **http://localhost:3000**

---

### 3. First Login

Open browser to http://localhost:3000

**Option A - Use seeded account:**
- Email: `admin@inventory.com`
- Password: `password`

**Option B - Register new account:**
- Click "Register"
- Fill in your details
- Login with your credentials

---

## Quick Test

1. **Add an item:**
   - Click "+ Add Item"
   - Name: "Laptop"
   - Quantity: 10
   - Unit: units
   - Click "Add Item(s)"

2. **Add stock:**
   - Click "+ Add" on the Laptop card
   - Enter quantity: 5
   - Click "Add Stock"

3. **View history:**
   - Click "History" on the Laptop card
   - See all transactions

4. **Search:**
   - Type "Laptop" in search bar
   - Results filter in real-time

---

## Troubleshooting

### Can't connect to database?
```bash
# Check MySQL is running
sudo service mysql start  # Linux
brew services start mysql  # Mac

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Port already in use?
```bash
# Backend - use different port
php artisan serve --port=8001

# Frontend - set PORT environment
PORT=3001 npm start
```

### CORS errors?
- Check `backend/config/cors.php`
- Verify `allowed_origins` includes `http://localhost:3000`
- Restart Laravel server

### Authentication not working?
```bash
# Clear Laravel cache
php artisan config:clear
php artisan cache:clear

# Clear browser localStorage
# Open DevTools > Application > Local Storage > Clear All
```

---

## Development Workflow

### Starting Development

Terminal 1:
```bash
cd backend
php artisan serve
```

Terminal 2:
```bash
cd frontend
npm start
```

### Resetting Database

```bash
cd backend
php artisan migrate:fresh --seed
```

### Viewing Logs

Backend logs:
```bash
tail -f backend/storage/logs/laravel.log
```

Frontend console:
- Open browser DevTools (F12)
- Check Console tab

---

## Next Steps

✅ System is running
✅ Try adding items
✅ Test bulk operations
✅ View transaction history
✅ Customize for your needs

---

## Need Help?

- Read full README.md
- Check Laravel docs: https://laravel.com/docs
- Check React docs: https://react.dev
- Review API endpoints in README.md

**You're all set! Start managing your inventory! 📦**
