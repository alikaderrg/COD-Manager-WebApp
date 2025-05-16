import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Profile from './Profile';
import StoreIntegration from './StoreIntegration';
import CourierIntegration from './CourierIntegration';
import WhatsAppIntegration from './WhatsAppIntegration';
import AppPreferences from './AppPreferences';
import Plans from './Plans';
import Logout from './Logout';

export default function ControlPanel() {
  return (
    <div className="p-4">
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/store" element={<StoreIntegration />} />
        <Route path="/courier" element={<CourierIntegration />} />
        <Route path="/whatsapp" element={<WhatsAppIntegration />} />
        <Route path="/preferences" element={<AppPreferences />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}
