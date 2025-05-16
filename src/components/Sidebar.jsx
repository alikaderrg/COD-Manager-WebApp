import React, { useState } from 'react';
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
      { path: '/orders/overview', label: 'Overview' },
      { path: '/orders/alerted', label: 'Alerted Orders' },
      { path: '/orders/confirmed', label: 'Confirmed Orders' },
      { path: '/orders/pending', label: 'Pending Orders' },
      { path: '/orders/cancelled', label: 'Cancelled Orders' },
      { path: '/orders/archived', label: 'Archived Orders' },
    ]
  },
  {
    label: 'Dispatch Center', icon: <Truck size={20} />, children: [
      { path: '/dispatch/bag-overview', label: 'Bag Overview' },
      { path: '/dispatch/orders', label: 'Dispatch Orders' },
      { path: '/dispatch/bag', label: 'Dispatch Bag' },
    ]
  },
  {
    label: 'Return Center', icon: <Undo2 size={20} />, children: [
      { path: '/returns/overview', label: 'Returns Overview' },
      { path: '/returns/reception', label: 'Return Reception' },
      { path: '/returns/history', label: 'Return History' },
    ]
  },
  {
    label: 'Picking & Packing', icon: <PackageCheck size={20} />, children: [
      { path: '/picking-packing/overview', label: 'Overview' },
      { path: '/picking-packing/picking', label: 'Picking' },
      { path: '/picking-packing/packing', label: 'Packing Station' },
    ]
  },
  {
    label: 'Product Inventory', icon: <Boxes size={20} />, children: [
      { path: '/inventory/list', label: 'Product List' },
      { path: '/inventory/reception', label: 'Reception' },
      { path: '/inventory/transfert', label: 'Transfert' },
      { path: '/inventory/defects', label: 'Defect Management' },
    ]
  },
  {
    label: 'Accounting', icon: <Calculator size={20} />, children: [
      { path: '/accounting/overview', label: 'Overview' },
      { path: '/accounting/expenses', label: 'Expenses & Purchases' },
      { path: '/accounting/salary', label: 'Payroll & Salary' },
      { path: '/accounting/invoices', label: 'Invoice Management' },
    ]
  },
  {
    label: 'HR & Team', icon: <Users size={20} />, children: [
      { path: '/hr/team', label: 'Team Members' },
      { path: '/hr/roles', label: 'Roles Management' },
      { path: '/hr/salary', label: 'Salary Management' },
      { path: '/hr/warehouse', label: 'Warehouse Management' },
    ]
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSubmenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <motion.aside
      initial={{ width: '4rem' }}
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      transition={{ duration: 0.2 }}
      className="bg-white shadow-lg h-screen border-r z-50 fixed rounded-r-xl"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className={`text-lg font-bold text-purple-700 ${isOpen ? 'block' : 'hidden'}`}>COD MANAGER</h1>
        <button onClick={toggleSidebar}>
          <Menu />
        </button>
      </div>
      <nav className="p-2 space-y-2">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                  ${item.children.some(child => location.pathname.startsWith(child.path))
                    ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
                onClick={() => isOpen && toggleSubmenu(item.label)}
                title={!isOpen ? item.label : undefined}
              >
                {item.icon}
                {isOpen && <span className="flex-1">{item.label}</span>}
                {isOpen && (openMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {(isOpen && openMenus[item.label]) || (!isOpen && item.children.some(c => location.pathname.startsWith(c.path))) ? (
                <div className={`ml-6 mt-1 space-y-1 ${isOpen ? '' : 'absolute left-16 bg-white p-2 rounded shadow-md'}`}>
                  {item.children.map(child => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`block text-sm px-3 py-1 rounded hover:bg-purple-50 ${
                        location.pathname === child.path ? 'bg-purple-100 text-purple-700' : ''
                      }`}
                      title={!isOpen ? child.label : undefined}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${location.pathname === item.path ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              title={!isOpen ? item.label : undefined}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </Link>
          )
        )}
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
