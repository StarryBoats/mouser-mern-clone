import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import NotificationBell from '../ui/NotificationBell';
import api from '../../services/api';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart?.items || []);
  const reduxCategories = useSelector((state) => state.admin?.categories || []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch categories from API on component mount or sync from Redux
  useEffect(() => {
    // If we have categories in Redux, use them
    if (reduxCategories.length > 0) {
      setCategories(reduxCategories);
      return;
    }

    // Otherwise fetch from API
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [reduxCategories]);

  // Click outside detection for category and user menu dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close categories if it's open and click is outside
      if (showCategories && categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
      // Only close user menu if it's open and click is outside
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    // Add listener on document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategories, showUserMenu]);

  // Mutual exclusivity: close categories when user menu opens
  useEffect(() => {
    if (showUserMenu) {
      setShowCategories(false);
    }
  }, [showUserMenu]);

  // Mutual exclusivity: close user menu when categories opens
  useEffect(() => {
    if (showCategories) {
      setShowUserMenu(false);
    }
  }, [showCategories]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${searchInput}`);
      setSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600 text-white grid place-items-center font-semibold text-lg">
              M
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-semibold text-slate-900">Mouser</p>
              <p className="text-xs text-slate-500">Electronics marketplace</p>
            </div>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl items-center gap-2">
          <input
            type="text"
            placeholder="Search products, categories, brands..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/products" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
            Products
          </Link>
          <div ref={categoriesRef} className="relative">
            <button
              type="button"
              onClick={() => setShowCategories((value) => !value)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition"
            >
              Categories <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {showCategories && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 top-full z-40 mt-2 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug || cat._id}
                        to={`/category/${cat.slug}`}
                        className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setShowCategories(false)}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">No categories available</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/cart" className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
            <ShoppingCart size={18} />
            Cart
            {cart.length > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((value) => !value)}
                className="inline-flex items-center justify-center rounded-full bg-slate-100 p-3 text-slate-700 hover:bg-slate-200 transition"
              >
                <User size={20} />
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="space-y-1 p-3">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <div className="border-t border-slate-200 p-2">
                      <Link
                        to={user.role === 'seller' ? `/seller/${user._id}` : '/user/profile'}
                        className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      {user.role === 'seller' && (
                        <Link
                          to="/seller/dashboard"
                          className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      {user.role && user.role !== 'seller' && user.role !== 'admin' && (
                        <Link
                          to="/apply"
                          className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Apply to Sell
                        </Link>
                      )}
                      <Link
                        to="/user/settings"
                        className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="mt-2 w-full rounded-xl bg-slate-100 px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-slate-200"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 md:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-slate-200 bg-slate-50 px-4 py-4 md:hidden"
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none"
              />
              <button type="submit" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Search
              </button>
            </form>
            <div className="mt-4 space-y-2">
              <Link
                to="/"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <button
                type="button"
                onClick={() => setShowCategories((value) => !value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700"
              >
                Categories
              </button>
              {showCategories && (
                <div className="mt-2 space-y-2 rounded-2xl border border-slate-200 bg-white p-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug || cat._id}
                        to={`/category/${cat.slug}`}
                        className="block rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => {
                          setShowCategories(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">No categories found</p>
                  )}
                </div>
              )}
              <Link
                to="/cart"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart {cart.length > 0 && `(${cart.length})`}
              </Link>
              <Link
                to="/sponsors"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sponsors
              </Link>
              {user ? (
                <>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Hello, {user.name}</p>
                  </div>
                  <Link
                    to={user.role === 'seller' ? `/seller/${user._id}` : '/user/profile'}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link
                      to="/seller/dashboard"
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  {user.role && user.role !== 'seller' && user.role !== 'admin' && (
                    <Link
                      to="/apply"
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Apply to Sell
                    </Link>
                  )}
                  <Link
                    to="/user/settings"
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

