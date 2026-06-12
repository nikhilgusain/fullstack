import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Profile from './pages/Profile';

// Import CSS Stylesheet
import './App.css';

// Dashboard layout wrapping protected routes and providing shared Task State
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine dynamic title for Header based on active routing path
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Analytics Dashboard';
      case '/tasks':
        return 'Sprint Board';
      case '/projects':
        return 'Active Projects';
      case '/profile':
        return 'User Claims & JWT Details';
      default:
        return 'TaskFlow';
    }
  };

  return (
    <TaskProvider>
      <div className="app-container">
        {/* Responsive Sidebar navigation links */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <div className="main-content">
          {/* Main header containing mobile triggers and JWT indicator */}
          <Header title={getHeaderTitle()} onMenuToggle={() => setSidebarOpen(true)} />
          
          {/* Main scrollable body rendering dashboard pages */}
          <main className="content-body">
            <Outlet />
          </main>
        </div>
      </div>
    </TaskProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Secure Layout Routes Protected by JWT Guards */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Catch-all route redirecting to Dashboard */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
