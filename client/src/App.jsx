// src/App.js  
import React from 'react';
import { CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Common/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <AppRoutes />
      <ToastContainer />
    </>
  );
};

export default App;  