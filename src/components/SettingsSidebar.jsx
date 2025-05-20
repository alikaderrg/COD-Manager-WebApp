import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Store, Truck, MessageSquare, SlidersHorizontal,
  CreditCard, LogOut, Menu
} from 'lucide-react';

const settingsItems = [
  { path: '/settings/profile', label: 'Profile', icon: <User size={20} /> },
  { path: '/settings/store', label: 'Store Integration', icon: <Store size={20} /> },
  { path: '/settings/courier', label: 'Courier Integration', icon: <Truck size={20} /> },
  { path: '/settings/whatsapp', label: 'WhatsApp', icon: <MessageSquare size={20} /> },
  { path: '/settings/preferences', label: 'Preferences', icon: <SlidersHorizontal size={20} /> },
  { path: '/settings/plans', label: 'Plans', icon: <CreditCard size={20} /> },
  { path: '/settings/logout', label: 'Logout', icon: <LogOut size={20} /> },
];

export default function SettingsSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.aside
      initial={{ width: '4rem' }}
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      transition={{ duration: 0.2 }}
      className="bg-white shadow-purple-lg h-screen border-r z-40 fixed left-16 top-0 rounded-r-xl"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className={`text-lg font-bold text-purple-600 ${isOpen ? 'block' : 'hidden'}`}>Settings</h1>
        <button onClick={toggleSidebar} className="ml-auto text-muted-foreground">
          <Menu />
        </button>
      </div>
      <nav className="px-2 py-4 space-y-2">
        {settingsItems.map(item => (
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
