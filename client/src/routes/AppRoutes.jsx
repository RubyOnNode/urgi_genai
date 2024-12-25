// src/routes/AppRoutes.js  
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/Common/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
            <Dashboard />
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;  