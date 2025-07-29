import React, { useState } from 'react';
import {
    Container,
    Box,
    Tabs,
    Tab,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    IconButton,
    InputAdornment,
    Grid
} from '@mui/material';
import { Calendar, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { validateUBBEmail } from '../utils/validators';
import { UBB_COLORS } from '../styles/colors';

const AuthPage = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0); // 0 login, 1 register
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        firstName: '',
        lastName: ''
    });

    const handleTabChange = (_e, value) => {
        setTab(value);
        setError('');
        setSuccess('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateUBBEmail(loginData.email)) {
            setError('Debes usar un correo institucional UBB (@alumnos.ubiobio.cl o @ubiobio.cl)');
            return;
        }

        setLoading(true);

        try {
            const data = await authService.login(loginData.email, loginData.password);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
            } else {
                setError('Error de conexión. Por favor, intenta más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateUBBEmail(registerData.email)) {
            setError('Debes usar un correo institucional UBB (@alumnos.ubiobio.cl o @ubiobio.cl)');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (registerData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...dataToSend } = registerData;
            const data = await authService.register(dataToSend);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setSuccess('¡Registro exitoso! Redirigiendo...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('El correo o usuario ya está registrado.');
            } else {
                setError('Error de conexión. Por favor, intenta más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #f8f8f8, #eaeaea)',
            p: 2
        }}>
            <Container maxWidth="xs">
                <Box textAlign="center" mb={3}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            mb: 1,
                            backgroundColor: UBB_COLORS.primary
                        }}
                    >
                        <Calendar color="white" size={32} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Portal de Eventos UBB
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tu calendario universitario en un solo lugar
                    </Typography>
                </Box>

                <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        textColor="inherit"
                        sx={{ '& .MuiTabs-indicator': { backgroundColor: UBB_COLORS.primary } }}
                    >
                        <Tab
                            label="Iniciar Sesión"
                            sx={tab === 0 ? { color: 'white', backgroundColor: UBB_COLORS.primary } : { color: '#555' }}
                        />
                        <Tab
                            label="Registrarse"
                            sx={tab === 1 ? { color: 'white', backgroundColor: UBB_COLORS.primary } : { color: '#555' }}
                        />
                    </Tabs>

                    <Box component="form" onSubmit={tab === 0 ? handleLogin : handleRegister} sx={{ p: 3 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}

                        {tab === 0 ? (
                            <>
                                <TextField
                                    label="Correo Institucional"
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={18} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        color: '#fff',
                                        backgroundColor: loading ? UBB_COLORS.gray : UBB_COLORS.primary,
                                        '&:hover': { backgroundColor: UBB_COLORS.primaryDark }
                                    }}
                                >
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nombre"
                                            value={registerData.firstName}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, firstName: e.target.value })
                                            }
                                            fullWidth
                                            required
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Apellido"
                                            value={registerData.lastName}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, lastName: e.target.value })
                                            }
                                            fullWidth
                                            required
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    label="Nombre de usuario"
                                    value={registerData.username}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, username: e.target.value })
                                    }
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <User size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    label="Correo Institucional"
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={registerData.password}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, password: e.target.value })
                                    }
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={18} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    label="Confirmar Contraseña"
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, confirmPassword: e.target.value })
                                    }
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        color: '#fff',
                                        backgroundColor: loading ? UBB_COLORS.gray : UBB_COLORS.primary,
                                        '&:hover': { backgroundColor: UBB_COLORS.primaryDark }
                                    }}
                                >
                                    {loading ? 'Registrando...' : 'Registrarse'}
                                </Button>
                            </>
                        )}
                    </Box>
                </Paper>

                <Typography
                    variant="caption"
                    display="block"
                    textAlign="center"
                    sx={{ mt: 2, color: 'text.secondary' }}
                >
                    Universidad del Bío-Bío © 2025
                </Typography>
            </Container>
        </Box>
    );
};

export default AuthPage;
