// src/components/Auth/Register.js  
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { Button, Container, Typography, Box, Alert } from '@mui/material';
import { registrationSchema } from '../../utils/validationSchema';
import { register } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registrationSchema}
          onSubmit={(values) => {
            dispatch(register(values));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ mb: 2 }}>
                <Field
                  component={TextField}
                  name="username"
                  type="text"
                  label="Username"
                  fullWidth
                />
              </Box>
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
              <Box sx={{ mb: 2 }}>
                <Field
                  component={TextField}
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
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
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;  