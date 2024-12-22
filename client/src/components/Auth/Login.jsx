// src/components/Auth/Login.js  
import React from 'react';
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

  React.useEffect(() => {
    if (token) {
      console.log(`In Login component ${token}`)
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            console.log(`Login Submit: ${values}`);
            dispatch(login(values));
          }}
        >
          {({ isSubmitting }) => (
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
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;  