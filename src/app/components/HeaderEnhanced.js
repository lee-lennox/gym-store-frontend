import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ShoppingCart, Settings, User as UserIcon, ChevronDown, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  const { setIsCartOpen, getCartCount } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // Check localStorage for user on mount
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    // Listen for login/logout events
    const handleUserChange = () => {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    };

    window.addEventListener('storage', handleUserChange);
    window.addEventListener('userLogin', handleUserChange);
    window.addEventListener('userLogout', handleUserChange);
    
    return () => {
      window.removeEventListener('storage', handleUserChange);
      window.removeEventListener('userLogin', handleUserChange);
      window.removeEventListener('userLogout', handleUserChange);
    };
  }, []);


  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userLogout'));
    window.location.href = '/';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">FitGear</span>
          </Link>
          
          {/* Navigation with Categories */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Products
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Section - Search, Icons, and User */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="ml-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Admin Dashboard - only show for ADMIN role */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors" 
                title="Admin Dashboard"
              >
                <Settings className="h-5 w-5" />
              </Link>
            )}
            
            <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.email}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.role || 'BUYER'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
