// src/App.js  
import { CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCurrentUser } from './features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux'; 

import { useEffect } from 'react';

const App = () => {

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch]); 


  return (
    <>
      <CssBaseline />
      <AppRoutes />
      <ToastContainer />
    </>
  );
};

export default App;  