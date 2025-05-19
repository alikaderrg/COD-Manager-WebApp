import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import SubSidebar from './components/SubSidebar';
import SettingsSidebar from './components/SettingsSidebar';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardOverview from './pages/Dashboard/Overview';
import ControlPanel from './pages/Settings/ControlPanel';

export default function App() {
  const location = useLocation();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setTokenChecked(true);
  }, []);

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (!tokenChecked) return null;

  if (!isAuthenticated && !isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const isSettingsPage = location.pathname.startsWith('/settings');

  const leftMargin = isSidebarOpen ? (isSettingsPage ? 'ml-[32rem]' : 'ml-64') : 'ml-16';

  return (
    <div className="flex min-h-screen">
      {!isAuthPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          setActiveSection={setActiveSection}
        />
      )}
      {!isAuthPage && !isSettingsPage && isSidebarOpen && (
        <SubSidebar activeSection={activeSection} />
      )}
      {!isAuthPage && isSettingsPage && <SettingsSidebar />}

      <main className={`flex-1 transition-all duration-300 px-4 py-6 ${leftMargin}`}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/settings/*" element={<ControlPanel />} />
            {/* Add other routes here */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
