import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, User, Store, Truck, MessageCircle, Sliders, CreditCard, LogOut, Menu } from 'lucide-react';

const settingsNav = [
  { path: '/settings/profile', label: 'Profile', icon: <User size={18} /> },
  { path: '/settings/store', label: 'Store Integration', icon: <Store size={18} /> },
  { path: '/settings/courier', label: 'Courier Integration', icon: <Truck size={18} /> },
  { path: '/settings/whatsapp', label: 'WhatsApp', icon: <MessageCircle size={18} /> },
  { path: '/settings/app', label: 'Preferences', icon: <Sliders size={18} /> },
  { path: '/settings/plans', label: 'Plans', icon: <CreditCard size={18} /> },
  { path: '/settings/logout', label: 'Logout', icon: <LogOut size={18} /> },
];

export default function SettingsSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const sidebarVariants = {
    open: { width: '16rem' },
    closed: { width: '4rem' },
  };

  return (
    <motion.aside
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="bg-white h-screen shadow-xl border-r border-gray-200 fixed z-40 transition-all duration-300 rounded-tr-xl rounded-br-xl"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {isOpen && <h2 className="text-lg font-bold text-purple-600">Settings</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500">
          <Menu size={20} />
        </button>
      </div>
      <nav className="p-2 space-y-2">
        {settingsNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              location.pathname === item.path ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
            }`}
            title={!isOpen ? item.label : undefined}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
