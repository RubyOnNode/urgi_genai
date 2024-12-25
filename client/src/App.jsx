// src/App.js  
import { CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <CssBaseline />
      <AppRoutes />
      <ToastContainer />
    </>
  );
};

export default App;  