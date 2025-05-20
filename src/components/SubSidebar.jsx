import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  LayoutDashboard,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Archive,
  Package,
  Truck,
  Send,
  RotateCcw,
  ClipboardCheck,
  ShoppingBag,
  Boxes,
  FileText,
  DollarSign,
  Users,
  UserCog,
  Wallet,
  Building
} from 'lucide-react';

const sectionMap = {
  'Order Management': [
    { path: '/OrderManagement/Overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/OrderManagement/Alerted', label: 'Alerted Orders', icon: <AlertTriangle size={18} /> },
    { path: '/OrderManagement/Confirmed', label: 'Confirmed Orders', icon: <CheckCircle size={18} /> },
    { path: '/OrderManagement/Pending', label: 'Pending Orders', icon: <Clock size={18} /> },
    { path: '/OrderManagement/Cancelled', label: 'Cancelled Orders', icon: <XCircle size={18} /> },
    { path: '/OrderManagement/Archived', label: 'Archived Orders', icon: <Archive size={18} /> },
  ],
  'Dispatch Center': [
    { path: '/DispatchCenter/BagOverview', label: 'Bag Overview', icon: <Package size={18} /> },
    { path: '/DispatchCenter/DispatchOrders', label: 'Dispatch Orders', icon: <Truck size={18} /> },
    { path: '/DispatchCenter/DispatchBag', label: 'Dispatch Bag', icon: <Send size={18} /> },
  ],
  'Return Center': [
    { path: '/ReturnCenter/Overview', label: 'Returns Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/ReturnCenter/ReturnReception', label: 'Return Reception', icon: <RotateCcw size={18} /> },
    { path: '/ReturnCenter/ReturnHistory', label: 'Return History', icon: <Archive size={18} /> },
  ],
  'Picking & Packing': [
    { path: '/PickingPacking/Overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/PickingPacking/Picking', label: 'Picking', icon: <ClipboardCheck size={18} /> },
    { path: '/PickingPacking/Packing', label: 'Packing Station', icon: <ShoppingBag size={18} /> },
  ],
  'Product Inventory': [
    { path: '/ProductInventory/Overview', label: 'Product Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/ProductInventory/ProductReception', label: 'Reception', icon: <Package size={18} /> },
    { path: '/ProductInventory/ProductTransfert', label: 'Transfert', icon: <Truck size={18} /> },
    { path: '/ProductInventory/DefectManagement', label: 'Defect Management', icon: <XCircle size={18} /> },
  ],
  Accounting: [
    { path: '/Accounting/Overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/Accounting/Expenses', label: 'Expenses & Purchases', icon: <DollarSign size={18} /> },
    { path: '/Accounting/PayrollSalary', label: 'Payroll & Salary', icon: <Wallet size={18} /> },
    { path: '/Accounting/Invoices', label: 'Invoice Management', icon: <FileText size={18} /> },
  ],
  'HR & Team': [
    { path: '/HR/TeamMembers', label: 'Team Members', icon: <Users size={18} /> },
    { path: '/HR/RolesManagement', label: 'Roles Management', icon: <UserCog size={18} /> },
    { path: '/HR/SalaryManagement', label: 'Salary Management', icon: <Wallet size={18} /> },
    { path: '/HR/WarehouseManagement', label: 'Warehouse Management', icon: <Building size={18} /> },
  ],
};

export default function SubSidebar({ activeSection, mainSidebarOpen, onCollapsedChange }) {
  const location = useLocation();
  const links = sectionMap[activeSection] || [];
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If no active section, don't render the sidebar
  if (!activeSection) return null;

  // Handle collapse state change
  const handleCollapseToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onCollapsedChange) {
      onCollapsedChange(newState);
    }
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isCollapsed ? '4rem' : '16rem',
        left: mainSidebarOpen ? '16rem' : '4rem'
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="bg-white border-r border-gray-200 shadow-purple-md h-screen fixed top-0 z-40 rounded-r-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h2 className="font-semibold text-purple-700 text-lg truncate">
            {activeSection}
          </h2>
        )}
        <button
          onClick={handleCollapseToggle}
          className="p-1 rounded-md hover:bg-purple-50 text-purple-700"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="px-2 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-purple-200">
        {links.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              location.pathname === item.path
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
