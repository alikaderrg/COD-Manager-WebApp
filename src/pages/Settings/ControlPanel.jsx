import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SettingsSidebar from '@/components/SettingsSidebar';
import Profile from '@/pages/Settings/Profile';
import StoreIntegration from '@/pages/Settings/StoreIntegration';
import CourierIntegration from '@/pages/Settings/CourierIntegration';
import WhatsAppIntegration from '@/pages/Settings/WhatsAppIntegration';
import AppPreferences from '@/pages/Settings/AppPreferences';
import Plans from '@/pages/Settings/Plans';
import Logout from '@/pages/Settings/Logout';

export default function ControlPanel() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto ml-16 md:ml-64 bg-gray-50 p-6">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/store" element={<StoreIntegration />} />
          <Route path="/courier" element={<CourierIntegration />} />
          <Route path="/whatsapp" element={<WhatsAppIntegration />} />
          <Route path="/app" element={<AppPreferences />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}
