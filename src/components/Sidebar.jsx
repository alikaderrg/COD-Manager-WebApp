import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Truck, Undo2, PackageCheck, Boxes,
  Calculator, Users, Settings, ChevronDown, ChevronRight, Menu
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  {
    label: 'Order Management', icon: <Package size={20} />, children: [
      { path: '/OrderManagement/Overview', label: 'Overview' },
      { path: '/OrderManagement/Alerted', label: 'Alerted Orders' },
      { path: '/OrderManagement/Confirmed', label: 'Confirmed Orders' },
      { path: '/OrderManagement/Pending', label: 'Pending Orders' },
      { path: '/OrderManagement/Cancelled', label: 'Cancelled Orders' },
      { path: '/OrderManagement/Archived', label: 'Archived Orders' },
    ]
  },
  {
    label: 'Dispatch Center', icon: <Truck size={20} />, children: [
      { path: '/DispatchCenter/BagOverview', label: 'Bag Overview' },
      { path: '/DispatchCenter/DispatchOrders', label: 'Dispatch Orders' },
      { path: '/DispatchCenter/DispatchBag', label: 'Dispatch Bag' },
    ]
  },
  {
    label: 'Return Center', icon: <Undo2 size={20} />, children: [
      { path: '/ReturnCenter/Overview', label: 'Returns Overview' },
      { path: '/ReturnCenter/ReturnReception', label: 'Return Reception' },
      { path: '/ReturnCenter/ReturnHistory', label: 'Return History' },
    ]
  },
  {
    label: 'Picking & Packing', icon: <PackageCheck size={20} />, children: [
      { path: '/PickingPacking/Overview', label: 'Overview' },
      { path: '/PickingPacking/Picking', label: 'Picking' },
      { path: '/PickingPacking/Packing', label: 'Packing Station' },
    ]
  },
  {
    label: 'Product Inventory', icon: <Boxes size={20} />, children: [
      { path: '/ProductInventory/Overview', label: 'Product Overview' },
      { path: '/ProductInventory/ProductReception', label: 'Reception' },
      { path: '/ProductInventory/ProductTransfert', label: 'Transfert' },
      { path: '/ProductInventory/DefectManagement', label: 'Defect Management' },
    ]
  },
  {
    label: 'Accounting', icon: <Calculator size={20} />, children: [
      { path: '/Accounting/Overview', label: 'Overview' },
      { path: '/Accounting/Expenses', label: 'Expenses & Purchases' },
      { path: '/Accounting/PayrollSalary', label: 'Payroll & Salary' },
      { path: '/Accounting/Invoices', label: 'Invoice Management' },
    ]
  },
  {
    label: 'HR & Team', icon: <Users size={20} />, children: [
      { path: '/HR/TeamMembers', label: 'Team Members' },
      { path: '/HR/RolesManagement', label: 'Roles Management' },
      { path: '/HR/SalaryManagement', label: 'Salary Management' },
      { path: '/HR/WarehouseManagement', label: 'Warehouse Management' },
    ]
  },
];

export default function Sidebar({ isOpen, setIsOpen, setActiveSection }) {
  const location = useLocation();

  const handleSectionClick = (item) => {
    if (item.children) {
      setActiveSection(item.label);
    } else {
      setActiveSection('');
    }
  };

  return (
    <motion.aside
      initial={{ width: '4rem' }}
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      transition={{ duration: 0.2 }}
      className="bg-white shadow-lg h-screen border-r z-50 fixed left-0 top-0 rounded-r-xl"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className={`text-lg font-bold text-purple-700 ${isOpen ? 'block' : 'hidden'}`}>
          COD MANAGER
        </h1>
        <button onClick={() => setIsOpen(!isOpen)}><Menu /></button>
      </div>

      <nav className="px-2 py-4 space-y-2 overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-thin scrollbar-thumb-gray-300">
        {navItems.map((item) => (
          <div key={item.label || item.path}>
            {item.children ? (
              <button
                onClick={() => handleSectionClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                ${item.children.some(c => location.pathname.startsWith(c.path))
                  ? 'bg-purple-100 text-purple-700'
                  : 'hover:bg-gray-100'}
                `}
                title={!isOpen ? item.label : undefined}
              >
                {item.icon}
                {isOpen && <span className="flex-1">{item.label}</span>}
                {isOpen && <ChevronRight size={16} />}
              </button>
            ) : (
              <Link
                to={item.path}
                onClick={() => handleSectionClick(item)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${location.pathname === item.path ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}
                `}
                title={!isOpen ? item.label : undefined}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-auto p-2 border-t">
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md text-muted-foreground">
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
