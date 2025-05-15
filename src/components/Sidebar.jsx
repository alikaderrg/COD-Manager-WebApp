import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Truck, Undo2, PackageCheck,
  Boxes, Calculator, Users, Settings, Menu
} from 'lucide-react';

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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.aside
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed z-30 top-0 left-0 h-full bg-white border-r shadow-lg
        rounded-tr-3xl rounded-br-3xl overflow-hidden
        transition-colors ease-in-out duration-300
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h1 className={`text-lg font-bold text-purple-600 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          COD MANAGER
        </h1>
        <button onClick={toggleSidebar} className="text-gray-500">
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 space-y-2">
        {navItems.map((item) =>
          item.children ? (
            <SidebarGroup key={item.label} item={item} isOpen={isOpen} currentPath={location.pathname} />
          ) : (
            <SidebarLink key={item.path} to={item.path} label={item.label} icon={item.icon} isOpen={isOpen} active={location.pathname === item.path} />
          )
        )}
      </nav>

      {/* Settings */}
      <div className="px-2 py-4 mt-auto border-t border-gray-200 bg-gray-50">
        {settingsNavItems.map((item) => (
          <SidebarLink key={item.path} to={item.path} label={item.label} icon={item.icon} isOpen={isOpen} active={location.pathname === item.path} />
        ))}
      </div>
    </motion.aside>
  );
}

const SidebarLink = ({ to, label, icon, isOpen, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
      ${active ? 'bg-purple-100 text-purple-700' : 'hover:bg-purple-50'}
      group`}
    title={!isOpen ? label : undefined}
  >
    {icon}
    {isOpen && <span>{label}</span>}
  </Link>
);

const SidebarGroup = ({ item, isOpen, currentPath }) => {
  const isActive = item.children.some((child) => currentPath.startsWith(child.path));

  return (
    <div className="group">
      <div className={`
        flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer
        ${isActive ? 'bg-purple-100 text-purple-700' : 'hover:bg-purple-50'}
      `}>
        {item.icon}
        {isOpen && <span className="ml-3">{item.label}</span>}
      </div>
      {(isOpen || !isOpen) && (
        <div className={`ml-${isOpen ? '6' : '0'} mt-1 space-y-1`}>
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              className={`block text-sm px-3 py-1 rounded-md hover:bg-purple-50 transition-colors
                ${currentPath === child.path ? 'bg-purple-100 text-purple-700' : ''}
                ${!isOpen ? 'ml-3 text-xs' : ''}
              `}
              title={!isOpen ? child.label : undefined}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
