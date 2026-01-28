# Inventory Management System

A full-stack inventory management application built with Laravel (backend) and React (frontend).

## Features

✅ User Authentication (Register/Login)
✅ Add single or multiple inventory items
✅ Different measurement units (kg, m, cm, units, l, g)
✅ Add stock to items (single or bulk)
✅ Deduct stock from items (single or bulk)
✅ Transaction history for each item
✅ Search items by name
✅ Real-time inventory tracking

## Tech Stack

**Backend:**
- Laravel 10+
- MySQL
- Laravel Sanctum (API Authentication)

**Frontend:**
- React 18
- React Router
- Axios

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 16+ and npm
- MySQL 5.7+
- Laravel CLI (optional but recommended)

## Installation & Setup

### Backend Setup (Laravel)

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install PHP dependencies:**
```bash
composer install
```

3. **Copy environment file:**
```bash
cp .env.example .env
# Or if .env.example doesn't exist, use the provided .env file
```

4. **Generate application key:**
```bash
php artisan key:generate
```

5. **Configure database in .env:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

6. **Create database:**
```bash
mysql -u root -p
CREATE DATABASE inventory_db;
EXIT;
```

7. **Run migrations:**
```bash
php artisan migrate
```

8. **Seed database (optional - creates a default user):**
```bash
php artisan db:seed
```
Default credentials:
- Email: admin@inventory.com
- Password: password

9. **Install Sanctum:**
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

10. **Start Laravel development server:**
```bash
php artisan serve
```
Backend will run at: http://localhost:8000

### Frontend Setup (React)

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start React development server:**
```bash
npm start
```
Frontend will run at: http://localhost:3000

## Usage Guide

### 1. Authentication

- Navigate to http://localhost:3000
- Register a new account or login with existing credentials
- If you seeded the database, use:
  - Email: admin@inventory.com
  - Password: password

### 2. Adding Items

**Single Item:**
- Click "Add Item" button
- Fill in item details (name, description, quantity, unit)
- Click "Add Item(s)"

**Multiple Items:**
- Click "Add Multiple Items" button
- Fill in first item details
- Click "+ Add Another Item" to add more
- Click "Add Item(s)" when done

### 3. Managing Stock

**Single Item Operations:**
- Find the item card
- Click "+ Add" to increase stock
- Click "- Deduct" to decrease stock
- Enter quantity and optional notes

**Bulk Operations:**
- Select multiple items using checkboxes
- Click "Add Stock (X)" or "Deduct Stock (X)" buttons
- Enter quantities for each selected item
- Click confirm

### 4. Viewing History

- Click "History" button on any item card
- View all transactions (additions/deductions)
- See transaction details: quantity, date, user, notes

### 5. Searching Items

- Use the search bar at the top
- Type item name to filter results
- Search updates in real-time

## API Endpoints

### Authentication
```
POST /api/register - Register new user
POST /api/login - Login user
POST /api/logout - Logout user (requires auth)
GET /api/user - Get authenticated user (requires auth)
```

### Inventory Items
```
GET /api/inventory-items - Get all items
GET /api/inventory-items?search=term - Search items
POST /api/inventory-items - Create single item
POST /api/inventory-items/bulk - Create multiple items
GET /api/inventory-items/{id} - Get item with transactions
PUT /api/inventory-items/{id} - Update item
DELETE /api/inventory-items/{id} - Delete item
```

### Stock Operations
```
POST /api/inventory-items/{id}/add-stock - Add stock to item
POST /api/inventory-items/{id}/deduct-stock - Deduct stock from item
POST /api/inventory-items/bulk-add - Add stock to multiple items
POST /api/inventory-items/bulk-deduct - Deduct stock from multiple items
```

## Database Schema

### users
- id
- name
- email
- password
- timestamps

### inventory_items
- id
- name
- description (nullable)
- quantity (decimal)
- unit (enum: kg, m, cm, units, l, g)
- timestamps

### inventory_transactions
- id
- inventory_item_id (foreign key)
- user_id (foreign key)
- type (enum: addition, deduction)
- quantity (decimal)
- notes (nullable)
- timestamps

## Project Structure

```
inventory-app/
├── backend/                    # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   │           ├── AuthController.php
│   │   │           └── InventoryItemController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── InventoryItem.php
│   │       └── InventoryTransaction.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── config/
│       └── cors.php
│
└── frontend/                   # React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Navbar.js
    │   │   ├── AddItemModal.js
    │   │   ├── StockModal.js
    │   │   ├── ItemHistoryModal.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## Common Issues & Solutions

### CORS Errors
- Ensure Laravel CORS is properly configured in `config/cors.php`
- Check that frontend URL (http://localhost:3000) is in allowed origins
- Verify `supports_credentials` is set to `true`

### Authentication Issues
- Clear browser localStorage
- Check if token is being sent in API requests
- Verify Sanctum is properly installed and configured

### Database Connection Errors
- Verify MySQL is running
- Check database credentials in .env
- Ensure database exists

### Port Already in Use
- Laravel: Change port with `php artisan serve --port=8001`
- React: Set PORT environment variable `PORT=3001 npm start`

## Development Tips

1. **Hot Reload:** Both servers support hot reload. Changes will reflect automatically.

2. **API Testing:** Use Postman or Thunder Client to test API endpoints directly.

3. **Database Reset:**
```bash
php artisan migrate:fresh --seed
```

4. **Clear Laravel Cache:**
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

5. **Check Laravel Logs:**
```bash
tail -f storage/logs/laravel.log
```

## Security Notes

- Never commit `.env` file
- Change `APP_KEY` in production
- Use strong passwords
- Implement rate limiting for production
- Use HTTPS in production
- Sanitize all user inputs

## Future Enhancements

- Image uploads for items
- Barcode/QR code generation
- Export reports (PDF, Excel)
- Email notifications for low stock
- Multi-user roles and permissions
- Dashboard analytics and charts
- Inventory categories
- Supplier management

## License

This project is open-source and available for educational purposes.

## Support

For issues or questions:
1. Check the documentation above
2. Review Laravel and React official documentation
3. Check common issues section
4. Create an issue in the repository

---

**Happy Inventory Managing! 📦**
