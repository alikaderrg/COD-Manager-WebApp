import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import SubSidebar from './components/SubSidebar';
import SettingsSidebar from './components/SettingsSidebar';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardOverview from './pages/Dashboard/Overview';
import ControlPanel from './pages/Settings/ControlPanel';
import CourierIntegration from './pages/Settings/CourierIntegration';

// Lazy-loaded components
const OrderManagementOverview = lazy(() => import('./pages/OrderManagement/Overview'));
const OrderManagementAlerted = lazy(() => import('./pages/OrderManagement/Alerted'));
const OrderManagementConfirmed = lazy(() => import('./pages/OrderManagement/Confirmed'));
const OrderManagementPending = lazy(() => import('./pages/OrderManagement/Pending'));
const OrderManagementCancelled = lazy(() => import('./pages/OrderManagement/Cancelled'));
const OrderManagementArchived = lazy(() => import('./pages/OrderManagement/Archived'));

const DispatchCenterBagOverview = lazy(() => import('./pages/DispatchCenter/BagOverview'));
const DispatchCenterDispatchOrders = lazy(() => import('./pages/DispatchCenter/DispatchOrders'));
const DispatchCenterDispatchBag = lazy(() => import('./pages/DispatchCenter/DispatchBag'));

const ReturnCenterOverview = lazy(() => import('./pages/ReturnCenter/Overview'));
const ReturnCenterReturnReception = lazy(() => import('./pages/ReturnCenter/ReturnReception'));
const ReturnCenterReturnHistory = lazy(() => import('./pages/ReturnCenter/ReturnHistory'));

const PickingPackingOverview = lazy(() => import('./pages/PickingPacking/Overview'));
const PickingPackingPicking = lazy(() => import('./pages/PickingPacking/Picking'));
const PickingPackingPacking = lazy(() => import('./pages/PickingPacking/Packing'));

const ProductInventoryOverview = lazy(() => import('./pages/ProductInventory/Overview'));
const ProductInventoryProductReception = lazy(() => import('./pages/ProductInventory/ProductReception'));
const ProductInventoryProductTransfert = lazy(() => import('./pages/ProductInventory/ProductTransfert'));
const ProductInventoryDefectManagement = lazy(() => import('./pages/ProductInventory/DefectManagement'));

const AccountingOverview = lazy(() => import('./pages/Accounting/Overview'));
const AccountingExpenses = lazy(() => import('./pages/Accounting/Expenses'));
const AccountingPayrollSalary = lazy(() => import('./pages/Accounting/PayrollSalary'));
const AccountingInvoices = lazy(() => import('./pages/Accounting/Invoices'));

const HRTeamMembers = lazy(() => import('./pages/HR/TeamMembers'));
const HRRolesManagement = lazy(() => import('./pages/HR/RolesManagement'));
const HRSalaryManagement = lazy(() => import('./pages/HR/SalaryManagement'));
const HRWarehouseManagement = lazy(() => import('./pages/HR/WarehouseManagement'));

export default function App() {
  const location = useLocation();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start with sidebar collapsed
  const [activeSection, setActiveSection] = useState('');
  const [isSubSidebarCollapsed, setIsSubSidebarCollapsed] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setTokenChecked(true);
  }, []);

  // Set active section based on URL path
  useEffect(() => {
    const path = location.pathname;
    // For HashRouter compatibility
    const hashPath = location.hash.replace('#', '');
    const effectivePath = hashPath || path;

    if (effectivePath.includes('OrderManagement')) {
      setActiveSection('Order Management');
    } else if (effectivePath.includes('DispatchCenter')) {
      setActiveSection('Dispatch Center');
    } else if (effectivePath.includes('ReturnCenter')) {
      setActiveSection('Return Center');
    } else if (effectivePath.includes('PickingPacking')) {
      setActiveSection('Picking & Packing');
    } else if (effectivePath.includes('ProductInventory')) {
      setActiveSection('Product Inventory');
    } else if (effectivePath.includes('Accounting')) {
      setActiveSection('Accounting');
    } else if (effectivePath.includes('HR')) {
      setActiveSection('HR & Team');
    } else {
      setActiveSection('');
    }
  }, [location.pathname, location.hash]);

  const isAuthPage = ['/login', '/signup'].includes(location.pathname) ||
                  ['#/login', '#/signup'].includes(location.hash);

  if (!tokenChecked) return null;

  // For development/demo purposes, skip authentication
  // In a real app, uncomment this block to enable authentication
  /*
  if (!isAuthenticated && !isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  */

  const isSettingsPage = location.pathname.startsWith('/settings') ||
                      location.hash.startsWith('#/settings');

  // Function to calculate the appropriate margin for main content
  const getMainContentMargin = () => {
    // For settings pages
    if (isSettingsPage) {
      return 'ml-20'; // Adjusted for better spacing
    }

    // For pages with active section and expanded subsidebar
    if (activeSection && !isSubSidebarCollapsed) {
      return 'ml-36'; // Adjusted for better spacing
    }

    // For pages with active section but collapsed subsidebar
    if (activeSection && isSubSidebarCollapsed) {
      return 'ml-24'; // Adjusted for better spacing
    }

    // Default case - just main sidebar
    return isSidebarOpen ? 'ml-24' : 'ml-20'; // Adjusted for better spacing
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden w-full">
      {/* Fixed position sidebars */}
      {!isAuthPage && (
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            setActiveSection={setActiveSection}
          />
        </div>
      )}

      {!isAuthPage && !isSettingsPage && activeSection && (
        <div className="fixed top-0 h-full z-20" style={{ left: isSidebarOpen ? '4rem' : '4rem' }}>
          <SubSidebar
            activeSection={activeSection}
            onCollapsedChange={setIsSubSidebarCollapsed}
            isCollapsed={isSubSidebarCollapsed}
          />
        </div>
      )}

      {!isAuthPage && isSettingsPage && (
        <div className="fixed left-4 top-0 h-full z-20">
          <SettingsSidebar />
        </div>
      )}

      {/* Main content with margin that ensures content is always visible and scaled */}
      <main className={`flex-1 p-6 ${getMainContentMargin()} w-full scale-content overflow-hidden`}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/settings" element={<ControlPanel />} />
            <Route path="/settings/courier" element={<CourierIntegration />} />

            {/* Order Management Routes */}
            <Route path="/OrderManagement/Overview" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OrderManagementOverview />
              </Suspense>
            } />
            <Route path="/OrderManagement/Alerted" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OrderManagementAlerted />
              </Suspense>
            } />
            <Route path="/OrderManagement/Confirmed" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OrderManagementConfirmed />
              </Suspense>
            } />
            <Route path="/OrderManagement/Pending" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OrderManagementPending />
              </Suspense>
            } />
            <Route path="/OrderManagement/Cancelled" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OrderManagementCancelled />
              </Suspense>
            } />
            <Route path="/OrderManagement/Archived" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OrderManagementArchived />
              </Suspense>
            } />

            {/* Dispatch Center Routes */}
            <Route path="/DispatchCenter/BagOverview" element={
              <Suspense fallback={<div>Loading...</div>}>
                <DispatchCenterBagOverview />
              </Suspense>
            } />
            <Route path="/DispatchCenter/DispatchOrders" element={
              <Suspense fallback={<div>Loading...</div>}>
                <DispatchCenterDispatchOrders />
              </Suspense>
            } />
            <Route path="/DispatchCenter/DispatchBag" element={
              <Suspense fallback={<div>Loading...</div>}>
                <DispatchCenterDispatchBag />
              </Suspense>
            } />

            {/* Return Center Routes */}
            <Route path="/ReturnCenter/Overview" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ReturnCenterOverview />
              </Suspense>
            } />
            <Route path="/ReturnCenter/ReturnReception" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ReturnCenterReturnReception />
              </Suspense>
            } />
            <Route path="/ReturnCenter/ReturnHistory" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ReturnCenterReturnHistory />
              </Suspense>
            } />

            {/* Picking & Packing Routes */}
            <Route path="/PickingPacking/Overview" element={
              <Suspense fallback={<div>Loading...</div>}>
                <PickingPackingOverview />
              </Suspense>
            } />
            <Route path="/PickingPacking/Picking" element={
              <Suspense fallback={<div>Loading...</div>}>
                <PickingPackingPicking />
              </Suspense>
            } />
            <Route path="/PickingPacking/Packing" element={
              <Suspense fallback={<div>Loading...</div>}>
                <PickingPackingPacking />
              </Suspense>
            } />

            {/* Product Inventory Routes */}
            <Route path="/ProductInventory/Overview" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProductInventoryOverview />
              </Suspense>
            } />
            <Route path="/ProductInventory/ProductReception" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProductInventoryProductReception />
              </Suspense>
            } />
            <Route path="/ProductInventory/ProductTransfert" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProductInventoryProductTransfert />
              </Suspense>
            } />
            <Route path="/ProductInventory/DefectManagement" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProductInventoryDefectManagement />
              </Suspense>
            } />

            {/* Accounting Routes */}
            <Route path="/Accounting/Overview" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AccountingOverview />
              </Suspense>
            } />
            <Route path="/Accounting/Expenses" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AccountingExpenses />
              </Suspense>
            } />
            <Route path="/Accounting/PayrollSalary" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AccountingPayrollSalary />
              </Suspense>
            } />
            <Route path="/Accounting/Invoices" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AccountingInvoices />
              </Suspense>
            } />

            {/* HR & Team Routes */}
            <Route path="/HR/TeamMembers" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HRTeamMembers />
              </Suspense>
            } />
            <Route path="/HR/RolesManagement" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HRRolesManagement />
              </Suspense>
            } />
            <Route path="/HR/SalaryManagement" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HRSalaryManagement />
              </Suspense>
            } />
            <Route path="/HR/WarehouseManagement" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HRWarehouseManagement />
              </Suspense>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
