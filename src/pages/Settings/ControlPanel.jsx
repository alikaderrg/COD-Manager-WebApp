import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import {
  UserCog,
  Plug,
  Truck,
  MessageSquare,
  Palette,
  CreditCard,
  LogOut,
} from 'lucide-react';
import Profile from '@/components/settings/Profile';
import StoreIntegration from '@/components/settings/StoreIntegration';
import CourierIntegration from '@/components/settings/CourierIntegration';
import WhatsAppIntegration from '@/components/settings/WhatsAppIntegration';
import AppPreferences from '@/components/settings/AppPreferences';
import Plans from '@/components/settings/Plans';
import Logout from '@/components/settings/Logout';

const navItems = [
  { path: 'profile', label: 'Profile / Store Info', icon: <UserCog size={18} /> },
  { path: 'store', label: 'Store Integration', icon: <Plug size={18} /> },
  { path: 'courier', label: 'Delivery Integration', icon: <Truck size={18} /> },
  { path: 'whatsapp', label: 'WhatsApp Integration', icon: <MessageSquare size={18} /> },
  { path: 'app', label: 'App Settings', icon: <Palette size={18} /> },
  { path: 'plans', label: 'Plans', icon: <CreditCard size={18} /> },
  { path: 'logout', label: 'Log Out', icon: <LogOut size={18} /> },
];

export default function SettingsControlPanel() {
  const location = useLocation();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted p-4">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <nav className="space-y-2">
          {navItems.map(({ path, label, icon }) => {
            const active = location.pathname.includes(`/settings/${path}`);
            return (
              <Link
                key={path}
                to={`/settings/${path}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${active ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground'}`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="store" element={<StoreIntegration />} />
          <Route path="courier" element={<CourierIntegration />} />
          <Route path="whatsapp" element={<WhatsAppIntegration />} />
          <Route path="app" element={<AppPreferences />} />
          <Route path="plans" element={<Plans />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
}
