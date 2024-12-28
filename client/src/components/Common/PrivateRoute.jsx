import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <div>Loading...</div> // Or a spinner component  
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;  