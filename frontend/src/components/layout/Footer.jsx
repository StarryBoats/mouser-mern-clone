import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Heart, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-blue-600 grid place-items-center text-lg font-semibold text-white">M</div>
              <div>
                <p className="text-xl font-semibold">Mouser</p>
                <p className="text-sm text-slate-400">Smart electronics sourcing</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              A modern electronics marketplace built for makers, engineers, and businesses. Simple browsing, faster checkout, and clear support.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="rounded-full bg-slate-800 p-3 hover:bg-blue-600 transition"><Facebook size={18} /></a>
              <a href="#" className="rounded-full bg-slate-800 p-3 hover:bg-blue-600 transition"><Twitter size={18} /></a>
              <a href="#" className="rounded-full bg-slate-800 p-3 hover:bg-blue-600 transition"><Linkedin size={18} /></a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Shop</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
                <li><Link to="/categories" className="hover:text-white transition">Categories</Link></li>
                <li><Link to="/sponsors" className="hover:text-white transition">Sponsors</Link></li>
                <li><Link to="/search" className="hover:text-white transition">Search</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Support</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li><Link to="/info/help-center" className="hover:text-white transition">Help Center</Link></li>
                <li><Link to="/info/contact-us" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/info/shipping-info" className="hover:text-white transition">Shipping</Link></li>
                <li><Link to="/info/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Stay updated</h3>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none"
                required
              />
              <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition">
                Subscribe
              </button>
            </form>
            {subscribed && <p className="text-sm text-emerald-400">Thanks! You’re on the list.</p>}
            <div className="space-y-3 text-slate-300">
              <div>
                <p className="text-sm font-semibold text-slate-200">Email</p>
                <p className="text-sm">support@mouser.com</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Phone</p>
                <p className="text-sm">+1 (888) 555-0123</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Address</p>
                <p className="text-sm">123 Tech Street, Silicon Valley, CA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Mouser Clone. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
            <span className="rounded-full border border-slate-800 px-3 py-1">Credit Card</span>
            <span className="rounded-full border border-slate-800 px-3 py-1">PayPal</span>
            <span className="rounded-full border border-slate-800 px-3 py-1">Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
