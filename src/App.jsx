import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import {
  LayoutDashboard,
  Package,
  Truck,
  Undo2,
  PackageCheck,
  Boxes,
  Calculator,
  Users,
  Settings,
} from 'lucide-react';

// App Pages
import DashboardOverview from '@/pages/Dashboard/Overview';
import OrderManagementOverview from '@/pages/OrderManagement/Overview';
import ConfirmedOrders from '@/pages/OrderManagement/Confirmed';
import PendingOrders from '@/pages/OrderManagement/Pending';
import DispatchCenterOverview from '@/pages/DispatchCenter/Overview';
import ReturnCenterOverview from '@/pages/ReturnCenter/Overview';
import PickingPackingOverview from '@/pages/PickingPacking/Overview';
import ProductInventoryOverview from '@/pages/ProductInventory/Overview';
import AccountingOverview from '@/pages/Accounting/Overview';
import HROverview from '@/pages/HR/Overview';
import SettingsControlPanel from '@/pages/Settings/ControlPanel';
import Profile from '@/pages/Settings/Profile';
import StoreIntegration from '@/pages/Settings/StoreIntegration';
import CourierIntegration from '@/pages/Settings/CourierIntegration';
import WhatsAppIntegration from '@/pages/Settings/WhatsAppIntegration';
import AppPreferences from '@/pages/Settings/AppPreferences';
import Plans from '@/pages/Settings/Plans';
import Logout from '@/pages/Settings/Logout';

// Auth Pages
import LoginPage from '@/pages/Auth/Login';
import SignupPage from '@/pages/Auth/Signup';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  {
    label: 'Order Management',
    icon: <Package size={20} />,
    children: [
      { path: '/orders/overview', label: 'Overview' },
      { path: '/orders/confirmed', label: 'Confirmed Orders' },
      { path: '/orders/pending', label: 'Pending Orders' },
    ],
  },
  { path: '/dispatch', label: 'Dispatch Center', icon: <Truck size={20} /> },
  { path: '/returns', label: 'Return Center', icon: <Undo2 size={20} /> },
  { path: '/picking-packing', label: 'Picking & Packing', icon: <PackageCheck size={20} /> },
  { path: '/inventory', label: 'Product Inventory', icon: <Boxes size={20} /> },
  { path: '/accounting', label: 'Accounting', icon: <Calculator size={20} /> },
  { path: '/hr', label: 'HR & Team', icon: <Users size={20} /> },
];

const settingsNavItems = [
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem('auth_token');
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isAuthenticated = Boolean(token);

  // If not logged in and not on login/signup, show blurred auth modal
  if (!isAuthenticated && !isAuthPage) {
    return (
      <div className="w-full h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <Routes>
          <Route path="*" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-secondary/30 text-foreground overflow-hidden">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 260 : 64 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className="bg-card border-r border-border shadow-lg h-full overflow-y-auto flex-shrink-0"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className={`text-lg font-bold text-primary transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>📦 COD MANAGER</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) =>
            item.children ? (
              <SidebarGroup key={item.label} item={item} isOpen={sidebarOpen} />
            ) : (
              <NavLink key={item.path} icon={item.icon} to={item.path} label={item.label} isOpen={sidebarOpen} />
            )
          )}
        </nav>
        <div className="px-2 py-4 border-t border-border">
          {settingsNavItems.map((item) => (
            <NavLink key={item.path} icon={item.icon} to={item.path} label={item.label} isOpen={sidebarOpen} />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/orders/overview" element={<OrderManagementOverview />} />
            <Route path="/orders/confirmed" element={<ConfirmedOrders />} />
            <Route path="/orders/pending" element={<PendingOrders />} />
            <Route path="/dispatch" element={<DispatchCenterOverview />} />
            <Route path="/returns" element={<ReturnCenterOverview />} />
            <Route path="/picking-packing" element={<PickingPackingOverview />} />
            <Route path="/inventory" element={<ProductInventoryOverview />} />
            <Route path="/accounting" element={<AccountingOverview />} />
            <Route path="/hr" element={<HROverview />} />
            <Route path="/settings/*" element={<SettingsControlPanel />} />
            <Route path="/settings/profile" element={<Profile />} />
            <Route path="/settings/store" element={<StoreIntegration />} />
            <Route path="/settings/courier" element={<CourierIntegration />} />
            <Route path="/settings/whatsapp" element={<WhatsAppIntegration />} />
            <Route path="/settings/app" element={<AppPreferences />} />
            <Route path="/settings/plans" element={<Plans />} />
            <Route path="/settings/logout" element={<Logout />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Toaster />
    </div>
  );
}

const NavLink = ({ to, label, icon, isOpen }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);

  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${active ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground'}`}>
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
};

const SidebarGroup = ({ item, isOpen }) => {
  const location = useLocation();
  const active = item.children.some(child => location.pathname.startsWith(child.path));
  return (
    <div>
      <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground'}`}>
        {item.icon}
        {isOpen && <span className="ml-3">{item.label}</span>}
      </div>
      {isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children.map((child) => (
            <Link key={child.path} to={child.path} className={`block text-sm px-3 py-1 rounded hover:bg-muted hover:text-foreground ${location.pathname === child.path ? 'bg-primary/10 text-primary' : ''}`}>{child.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
