import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const sectionMap = {
  'Order Management': [
    { path: '/OrderManagement/Overview', label: 'Overview' },
    { path: '/OrderManagement/Alerted', label: 'Alerted Orders' },
    { path: '/OrderManagement/Confirmed', label: 'Confirmed Orders' },
    { path: '/OrderManagement/Pending', label: 'Pending Orders' },
    { path: '/OrderManagement/Cancelled', label: 'Cancelled Orders' },
    { path: '/OrderManagement/Archived', label: 'Archived Orders' },
  ],
  'Dispatch Center': [
    { path: '/DispatchCenter/BagOverview', label: 'Bag Overview' },
    { path: '/DispatchCenter/DispatchOrders', label: 'Dispatch Orders' },
    { path: '/DispatchCenter/DispatchBag', label: 'Dispatch Bag' },
  ],
  'Return Center': [
    { path: '/ReturnCenter/Overview', label: 'Returns Overview' },
    { path: '/ReturnCenter/ReturnReception', label: 'Return Reception' },
    { path: '/ReturnCenter/ReturnHistory', label: 'Return History' },
  ],
  'Picking & Packing': [
    { path: '/PickingPacking/Overview', label: 'Overview' },
    { path: '/PickingPacking/Picking', label: 'Picking' },
    { path: '/PickingPacking/Packing', label: 'Packing Station' },
  ],
  'Product Inventory': [
    { path: '/ProductInventory/Overview', label: 'Product Overview' },
    { path: '/ProductInventory/ProductReception', label: 'Reception' },
    { path: '/ProductInventory/ProductTransfert', label: 'Transfert' },
    { path: '/ProductInventory/DefectManagement', label: 'Defect Management' },
  ],
  Accounting: [
    { path: '/Accounting/Overview', label: 'Overview' },
    { path: '/Accounting/Expenses', label: 'Expenses & Purchases' },
    { path: '/Accounting/PayrollSalary', label: 'Payroll & Salary' },
    { path: '/Accounting/Invoices', label: 'Invoice Management' },
  ],
  'HR & Team': [
    { path: '/HR/TeamMembers', label: 'Team Members' },
    { path: '/HR/RolesManagement', label: 'Roles Management' },
    { path: '/HR/SalaryManagement', label: 'Salary Management' },
    { path: '/HR/WarehouseManagement', label: 'Warehouse Management' },
  ],
};

export default function SubSidebar({ activeSection }) {
  const location = useLocation();
  const links = sectionMap[activeSection] || [];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 shadow-inner h-screen fixed left-64 top-0 z-40">
      <div className="p-4 font-semibold text-gray-700 text-lg border-b">
        {activeSection}
      </div>
      <nav className="px-4 py-2 space-y-1">
        {links.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded-md transition-colors ${
              location.pathname === item.path
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
