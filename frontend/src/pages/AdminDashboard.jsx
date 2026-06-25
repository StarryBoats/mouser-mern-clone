import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Users, BarChart2, TrendingUp, DollarSign, ShoppingCart, StoreIcon, Layers, Palette, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setSellerApplications, setAdminProducts, setSponsors } from '../store/adminSlice';
import BackButton from '../components/ui/BackButton';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellerApplications, products, sponsors } = useSelector((state) => state.admin);
  const cart = useSelector((state) => state.cart.items || []);
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState([]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      variants={itemVariants}
      className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white`}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className="opacity-50" />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-50 py-6 md:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-4">
        <BackButton />
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">A clean overview of your products, sellers, and store performance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={Package}
            title="Total Products"
            value={Array.isArray(products) ? products.length : 0}
            color="from-sky-500 to-blue-600"
          />
          <StatCard
            icon={Users}
            title="Seller Applications"
            value={Array.isArray(sellerApplications) ? sellerApplications.length : 0}
            color="from-violet-500 to-fuchsia-600"
          />
          <StatCard
            icon={ShoppingCart}
            title="Sponsors"
            value={Array.isArray(sponsors) ? sponsors.length : 0}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Open Orders"
            value={Array.isArray(cart) ? cart.length : 0}
            color="from-orange-500 to-amber-600"
          />
          <StatCard
            icon={Layers}
            title="Categories"
            value={Array.isArray(categories) ? categories.length : 0}
            color="from-cyan-500 to-sky-600"
          />
          <StatCard
            icon={BarChart2}
            title="Pending Reviews"
            value={Array.isArray(products) ? products.filter((p) => p.reviewStatus === 'pending').length : 0}
            color="from-rose-500 to-pink-600"
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
            <p className="mt-2 text-sm text-slate-600">Jump directly to the key admin sections.</p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition"
              >
                Manage Products
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/seller-applications')}
                className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-700 transition"
              >
                Review Sellers
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/home-settings')}
                className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-white hover:bg-slate-900 transition"
              >
                Home Page Settings
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Store Health</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Healthy</h3>
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-blue-700">Live</div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Products</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{Array.isArray(products) ? products.length : 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Seller Requests</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{Array.isArray(sellerApplications) ? sellerApplications.length : 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Traffic Snapshot</h2>
            <p className="mt-2 text-sm text-slate-600">A quick look at recent activity.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Active carts</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{Array.isArray(cart) ? cart.length : 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Sponsors</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{Array.isArray(sponsors) ? sponsors.length : 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

              <p className="text-xs text-gray-500 mt-1">Total in catalog</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              🛠️ Manage Now →
            </motion.span>
          </motion.button>

          {/* Sponsors Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/sponsors')}
            className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-green-100 hover:border-green-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Sponsors</h3>
                <p className="text-xs text-green-600 font-semibold mt-1 uppercase tracking-wide">Manage Promotions</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
              >
                <BarChart2 size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-green-200"
              whileHover={{ backgroundColor: '#f0fdf4' }}
            >
              <p className="text-3xl font-bold text-green-600">{Array.isArray(sponsors) ? sponsors.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Active sponsors</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              ⭐ Manage →
            </motion.span>
          </motion.button>

          {/* Current Sellers Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/sellers')}
            className="bg-gradient-to-br from-indigo-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-indigo-100 hover:border-indigo-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Current Sellers</h3>
                <p className="text-xs text-indigo-600 font-semibold mt-1 uppercase tracking-wide">Approved & Active</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
              >
                <Users size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-indigo-200"
              whileHover={{ backgroundColor: '#f5f3ff' }}
            >
              <p className="text-3xl font-bold text-indigo-600">💼</p>
              <p className="text-xs text-gray-500 mt-1">Manage & monitor</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              👨‍💼 View All →
            </motion.span>
          </motion.button>

          {/* Manage Categories Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/categories')}
            className="bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-cyan-100 hover:border-cyan-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Manage Categories</h3>
                <p className="text-xs text-cyan-600 font-semibold mt-1 uppercase tracking-wide">Product Organization</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <Layers size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-cyan-200"
              whileHover={{ backgroundColor: '#f0f9ff' }}
            >
              <p className="text-3xl font-bold text-cyan-600">{Array.isArray(categories) ? categories.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total categories active</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              ✨ Edit Categories →
            </motion.span>
          </motion.button>

          {/* Manage Help Pages Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/help-pages')}
            className="bg-gradient-to-br from-green-50 via-teal-50 to-green-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-green-100 hover:border-green-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Manage Help Pages</h3>
                <p className="text-xs text-green-600 font-semibold mt-1 uppercase tracking-wide">Support Content</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <Edit size={24} />
              </motion.div>
            </motion.div>
            <motion.div
              className="mb-4 p-3 bg-white rounded-lg border border-green-200"
              whileHover={{ backgroundColor: '#f0fef7' }}
            >
              <p className="text-sm text-green-600 font-semibold">Create and modify pages</p>
            </motion.div>
            <motion.span
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              📄 Go to Help Pages →
            </motion.span>
          </motion.button>

          {/* Customize Homepage Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/home-settings')}
            className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-purple-100 hover:border-purple-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Customize Homepage</h3>
                <p className="text-xs text-purple-600 font-semibold mt-1 uppercase tracking-wide">Hero Text & Featured Items</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
              >
                <Palette size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-purple-200"
              whileHover={{ backgroundColor: '#faf5ff' }}
            >
              <p className="text-sm text-purple-600 font-semibold">Hero Banner • Categories • Products • Background</p>
              <p className="text-xs text-gray-500 mt-1">Create a custom homepage experience</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              🎨 Customize Homepage →
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Analytics & System Health */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">⚡ System Health & Analytics</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 rounded-xl border border-cyan-400/30 hover:border-cyan-400/60 transition"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-cyan-300 font-semibold uppercase tracking-wide text-sm">Platform Health</p>
                <span className="text-2xl">💚</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full" 
                  style={{ width: '92%' }}
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-300 mt-3">✅ 92% • Everything running smoothly</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-400/30 hover:border-green-400/60 transition"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-300 font-semibold uppercase tracking-wide text-sm">User Engagement</p>
                <span className="text-2xl">📊</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" 
                  style={{ width: '78%' }}
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-300 mt-3">📈 78% • Positive trend</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-xl border border-orange-400/30 hover:border-orange-400/60 transition"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-orange-300 font-semibold uppercase tracking-wide text-sm">Data Integrity</p>
                <span className="text-2xl">🔒</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full" 
                  style={{ width: '99%' }}
                  initial={{ width: 0 }}
                  animate={{ width: '99%' }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-300 mt-3">✔️ 99% • All systems secure</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Activity Feed & Admin Logs - make dashboard longer */}
        <motion.div
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Recent Admin Activity</h3>
            <div className="space-y-3 max-h-64 overflow-auto">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">🛠️</div>
                  <div>
                    <p className="text-sm font-semibold">Updated Homepage settings</p>
                    <p className="text-xs text-gray-500">by AdminUser • {i*3} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">System Logs</h3>
            <div className="text-xs text-gray-500 space-y-2 max-h-64 overflow-auto">
              <div>03/18 10:12 - Backup completed successfully</div>
              <div>03/18 09:50 - New sponsor added: Acme Corp</div>
              <div>03/17 22:11 - User locked out after failed logins</div>
              <div>03/17 18:02 - Product review queue processed</div>
              <div>03/16 12:33 - Mailer service verified</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
