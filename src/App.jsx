import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';

import Sidebar from '@/components/Sidebar';

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

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  if (!isAuthenticated && !isAuthPage) {
    return (
      <div className="w-full h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<SignupPage />} />
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
      <Sidebar />

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
            <Route path="/settings" element={<SettingsControlPanel />} />
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

export default App;
