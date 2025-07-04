import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Complaints from './pages/Complaints';
import LeaveRequests from './pages/LeaveRequests';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App; 