import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Apple, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Apple className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-semibold text-gray-900">Apple Services</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-gray-700 hover:text-gray-900 transition-colors ${
                    location.pathname === '/dashboard' ? 'font-semibold' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;