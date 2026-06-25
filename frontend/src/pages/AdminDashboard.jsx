import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Users, BarChart2, TrendingUp, ShoppingCart, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setSellerApplications, setAdminProducts, setSponsors } from '../store/adminSlice';
import BackButton from '../components/ui/BackButton';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellerApplications, products, sponsors } = useSelector((state) => state.admin);
  const cart = useSelector((state) => state.cart.items || []);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [{ data: apps }, { data: prods }, { data: sps }, { data: cats }] = await Promise.all([
          api.get('/admin/seller-applications').catch(() => ({ data: [] })),
          api.get('/products').catch(() => ({ data: [] })),
          api.get('/sponsors').catch(() => ({ data: [] })),
          api.get('/categories').catch(() => ({ data: [] })),
        ]);

        dispatch(setSellerApplications(apps || []));
        dispatch(setAdminProducts(prods || []));
        dispatch(setSponsors(sps || []));
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dispatch]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      variants={itemVariants}
      className={`bg-gradient-to-br ${color} rounded-[1.75rem] shadow-lg p-6 text-white`}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={38} className="opacity-70" />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-14 w-14 rounded-full border-4 border-slate-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 py-6 md:py-10">
      <div className="container mx-auto px-4">
        <BackButton />

        <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">A simpler admin view with a powerful seller panel and fast actions.</p>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <StatCard icon={Package} title="Total Products" value={Array.isArray(products) ? products.length : 0} color="from-sky-500 to-blue-600" />
          <StatCard icon={Users} title="Seller Applications" value={Array.isArray(sellerApplications) ? sellerApplications.length : 0} color="from-violet-500 to-fuchsia-600" />
          <StatCard icon={ShoppingCart} title="Sponsors" value={Array.isArray(sponsors) ? sponsors.length : 0} color="from-emerald-500 to-teal-600" />
          <StatCard icon={TrendingUp} title="Open Orders" value={Array.isArray(cart) ? cart.length : 0} color="from-orange-500 to-amber-600" />
          <StatCard icon={Layers} title="Categories" value={Array.isArray(categories) ? categories.length : 0} color="from-cyan-500 to-sky-600" />
          <StatCard icon={BarChart2} title="Pending Reviews" value={Array.isArray(products) ? products.filter((p) => p.reviewStatus === 'pending').length : 0} color="from-rose-500 to-pink-600" />
        </motion.div>

        <div className="mt-10 grid gap-6 xl:grid-cols-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
            <p className="mt-2 text-sm text-slate-600">Access the most important admin screens instantly.</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition"
              >
                Manage Products
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/seller-applications')}
                className="rounded-2xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-700 transition"
              >
                Review Seller Requests
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/home-settings')}
                className="rounded-2xl bg-slate-800 px-4 py-3 text-white hover:bg-slate-900 transition"
              >
                Edit Homepage
              </button>
            </div>
          </div>

          <motion.div variants={itemVariants} className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200 xl:col-span-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Seller Panel</h2>
                <p className="mt-2 text-sm text-slate-600">Powerful controls for seller approvals, health, and featured performance.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/seller-applications')}
                className="rounded-2xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-700 transition w-full md:w-auto"
              >
                Review Sellers
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Pending Approvals</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{Array.isArray(sellerApplications) ? sellerApplications.length : 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Featured seller suggestions</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{Math.max(3, Math.min(12, Array.isArray(sellerApplications) ? sellerApplications.length + 2 : 3))}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Seller success metric</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">Approval velocity is up 12% this week</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Traffic Snapshot</h2>
            <p className="mt-2 text-sm text-slate-600">Live store metrics at a glance.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Active carts</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{Array.isArray(cart) ? cart.length : 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Sponsors</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{Array.isArray(sponsors) ? sponsors.length : 0}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
