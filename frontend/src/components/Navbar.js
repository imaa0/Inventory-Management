import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>📦 Inventory Management</h1>
      <div className="navbar-right">
        <span>Welcome, {user?.name}</span>
        <button onClick={logout} className="btn-danger">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
