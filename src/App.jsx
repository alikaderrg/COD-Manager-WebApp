import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar';
import SettingsSidebar from './components/SettingsSidebar';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Dashboard
import DashboardOverview from './pages/Dashboard/Overview';

// Settings
import ControlPanel from './pages/Settings/ControlPanel';

// Order Management
import OMOverview from './pages/OrderManagement/Overview';
import OMAlerted from './pages/OrderManagement/Alerted';
import OMConfirmed from './pages/OrderManagement/Confirmed';
import OMPending from './pages/OrderManagement/Pending';
import OMCancelled from './pages/OrderManagement/Cancelled';
import OMArchived from './pages/OrderManagement/Archived';

// Dispatch Center
import DCBags from './pages/DispatchCenter/BagOverview';
import DCOrders from './pages/DispatchCenter/DispatchOrders';
import DCAssign from './pages/DispatchCenter/DispatchBag';

// Return Center
import RCOverview from './pages/ReturnCenter/Overview';
import RCReception from './pages/ReturnCenter/ReturnReception';
import RCHistory from './pages/ReturnCenter/ReturnHistory';

// Picking & Packing
import PPOverview from './pages/PickingPacking/Overview';
import PPPicking from './pages/PickingPacking/Picking';
import PPPacking from './pages/PickingPacking/Packing';

// Product Inventory
import PIOverview from './pages/ProductInventory/Overview';
import PIReception from './pages/ProductInventory/ProductReception';
import PITransfert from './pages/ProductInventory/ProductTransfert';
import PIDefect from './pages/ProductInventory/DefectManagement';

// Accounting
import AccOverview from './pages/Accounting/Overview';
import AccExpenses from './pages/Accounting/Expenses';
import AccPayroll from './pages/Accounting/PayrollSalary';
import AccInvoices from './pages/Accounting/Invoices';

// HR
import HRTeam from './pages/HR/TeamMembers';
import HRRoles from './pages/HR/RolesManagement';
import HRSalary from './pages/HR/SalaryManagement';
import HRWarehouse from './pages/HR/WarehouseManagement';

export default function App() {
  const location = useLocation();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isSettingsPage = location.pathname.startsWith('/settings');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setTokenChecked(true);
  }, []);

  if (!tokenChecked) return null;

  if (!isAuthenticated && !isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isAuthPage && <Sidebar />}
      {!isAuthPage && isSettingsPage && <SettingsSidebar />}

      <main
        className={`flex-1 transition-all duration-300 p-4 ${
          !isAuthPage ? (isSettingsPage ? 'ml-16 md:ml-64 mr-64' : 'ml-16 md:ml-64') : ''
        }`}
      >
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />

            {/* Order Management */}
            <Route path="/OrderManagement/Overview" element={<OMOverview />} />
            <Route path="/OrderManagement/Alerted" element={<OMAlerted />} />
            <Route path="/OrderManagement/Confirmed" element={<OMConfirmed />} />
            <Route path="/OrderManagement/Pending" element={<OMPending />} />
            <Route path="/OrderManagement/Cancelled" element={<OMCancelled />} />
            <Route path="/OrderManagement/Archived" element={<OMArchived />} />

            {/* Dispatch Center */}
            <Route path="/DispatchCenter/BagOverview" element={<DCBags />} />
            <Route path="/DispatchCenter/DispatchOrders" element={<DCOrders />} />
            <Route path="/DispatchCenter/DispatchBag" element={<DCAssign />} />

            {/* Return Center */}
            <Route path="/ReturnCenter/Overview" element={<RCOverview />} />
            <Route path="/ReturnCenter/ReturnReception" element={<RCReception />} />
            <Route path="/ReturnCenter/ReturnHistory" element={<RCHistory />} />

            {/* Picking & Packing */}
            <Route path="/PickingPacking/Overview" element={<PPOverview />} />
            <Route path="/PickingPacking/Picking" element={<PPPicking />} />
            <Route path="/PickingPacking/Packing" element={<PPPacking />} />

            {/* Product Inventory */}
            <Route path="/ProductInventory/Overview" element={<PIOverview />} />
            <Route path="/ProductInventory/ProductReception" element={<PIReception />} />
            <Route path="/ProductInventory/ProductTransfert" element={<PITransfert />} />
            <Route path="/ProductInventory/DefectManagement" element={<PIDefect />} />

            {/* Accounting */}
            <Route path="/Accounting/Overview" element={<AccOverview />} />
            <Route path="/Accounting/Expenses" element={<AccExpenses />} />
            <Route path="/Accounting/PayrollSalary" element={<AccPayroll />} />
            <Route path="/Accounting/Invoices" element={<AccInvoices />} />

            {/* HR */}
            <Route path="/HR/TeamMembers" element={<HRTeam />} />
            <Route path="/HR/RolesManagement" element={<HRRoles />} />
            <Route path="/HR/SalaryManagement" element={<HRSalary />} />
            <Route path="/HR/WarehouseManagement" element={<HRWarehouse />} />

            {/* Settings */}
            <Route path="/settings/*" element={<ControlPanel />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
