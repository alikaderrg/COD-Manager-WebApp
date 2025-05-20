import React from 'react';
import CourierIntegration from './pages/Settings/CourierIntegration';

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">COD Manager</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <CourierIntegration />
      </div>
    </div>
  );
}
