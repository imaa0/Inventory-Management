# Inventory Management System

A full-stack inventory management application built with Laravel (backend) and React (frontend).

## Features

User Authentication (Register/Login)
Add single or multiple inventory items
Different measurement units (kg, m, cm, units, l, g)
Add stock to items (single or bulk)
Deduct stock from items (single or bulk)
Transaction history for each item
Search items by name
Real-time inventory tracking

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


