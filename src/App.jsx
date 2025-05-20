import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import CourierIntegration from './pages/Settings/CourierIntegration';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<CourierIntegration />} />
          <Route path="/settings/courier" element={<CourierIntegration />} />
          <Route path="*" element={<CourierIntegration />} />
        </Routes>
      </div>
    </div>
  );
}
