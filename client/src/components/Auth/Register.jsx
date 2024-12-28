import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { Button, Container, Typography, Box, Alert, Link as MUILink } from '@mui/material';
import { registrationSchema } from '../../utils/validationSchema';
import { register } from '../../features/auth/authSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';  

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);
    const [localError, setLocalError] = useState(null); // Local error state
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true); // Prevent multiple submissions
        setLocalError(null); // Clear previous error
        try {
            await dispatch(register(values)).unwrap(); // Dispatch action and wait for response
        } catch (err) {
            setLocalError(err.message || 'Registration failed'); // Handle errors
        } finally {
            setIsSubmitting(false); // Re-enable the form
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    }}
                    validationSchema={registrationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
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
                            {(localError || error) && (
                                <Alert severity="error" sx={{mt:1}}>
                                    {localError || error}
                                </Alert>
                            )}
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <MUILink component={RouterLink} to="/login" underline="hover">
                                        Login
                                    </MUILink>
                                </Typography>
                            </Box>  
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default Register;
