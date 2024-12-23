// src/components/Auth/Login.js  
import {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { Button, Container, Typography, Box, Alert } from '@mui/material';
import { login } from '../../features/auth/authSlice';
import { loginSchema } from '../../utils/validationSchema';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState(null); // Local error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  useEffect(() => {
    if (token) {
      console.log(`In Login component ${token}`)
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (values) => {
          setIsSubmitting(true); // Prevent multiple submissions
          setLocalError(null); // Clear previous error
          try {
            await dispatch(login(values)).unwrap(); // Dispatch action and wait for response
              console.log('Login successful');
          } catch (err) {
              setLocalError(err.message || 'Login failed'); // Handle errors
          } finally {
              setIsSubmitting(false); // Re-enable the form
          }
      };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <Box sx={{ mb: 2 }}>
                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  label="Email"
                  fullWidth
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Field
                  component={TextField}
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              {(localError || error) && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {localError || error}
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;  