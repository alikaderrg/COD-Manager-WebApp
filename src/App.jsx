import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import SettingsSidebar from './components/SettingsSidebar';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardOverview from './pages/Dashboard/Overview';
import ControlPanel from './pages/Settings/ControlPanel';

export default function App() {
  const location = useLocation();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setTokenChecked(true);
  }, []);

  if (!tokenChecked) return null;

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (!isAuthenticated && !isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen">
      {!isAuthPage && <Sidebar />}
      {!isAuthPage && location.pathname.startsWith('/settings') && <SettingsSidebar />}
      <main className={`flex-1 ml-16 md:ml-64 transition-all p-4`}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/settings/*" element={<ControlPanel />} />
            {/* Add your other app routes here */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
