import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Settings,
} from 'lucide-react';

import DashboardOverview from '@/pages/Dashboard/Overview';
import OrderManagementOverview from '@/pages/OrderManagement/Overview';
import DispatchCenterOverview from '@/pages/DispatchCenter/Overview';
import HROverview from '@/pages/HR/Overview';
import SettingsControlPanel from '@/pages/Settings/ControlPanel';
import Login from '@/pages/Auth/Login';
import Signup from '@/pages/Auth/Signup';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/orders', label: 'Orders', icon: <Package size={20} /> },
  { path: '/dispatch', label: 'Dispatch', icon: <Truck size={20} /> },
  { path: '/hr', label: 'HR', icon: <Users size={20} /> },
];

const settingsNavItems = [
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gradient-to-br from-background to-secondary/30 text-foreground overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="w-64 bg-card border-r border-border flex flex-col shadow-lg flex-shrink-0"
        >
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-primary">📦 COD Manager</h1>
            <p className="text-sm text-muted-foreground">Algeria Edition</p>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink key={item.path} icon={item.icon} to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-border mt-auto space-y-1">
            {settingsNavItems.map((item) => (
              <NavLink key={item.path} icon={item.icon} to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/orders" element={<OrderManagementOverview />} />
              <Route path="/dispatch" element={<DispatchCenterOverview />} />
              <Route path="/hr" element={<HROverview />} />
              <Route path="/settings" element={<SettingsControlPanel />} />
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

const NavLink = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ x: 5, backgroundColor: 'hsl(var(--accent))' }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground hover:text-accent-foreground hover:bg-accent'
        }`}
      >
        {icon && (
          <span className={`mr-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            {icon}
          </span>
        )}
        {children}
      </motion.div>
    </Link>
  );
};

export default App;
