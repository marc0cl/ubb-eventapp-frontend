import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Button
} from '@mui/material';
import { Calendar, List, User, LogOut } from 'lucide-react';
import authService from '../services/authService';
import { UBB_COLORS } from '../styles/colors';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #f8f8f8, #eaeaea)',
                p: 2
            }}
        >
            <Container maxWidth="md">
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 'bold', color: UBB_COLORS.primary, mb: 4 }}
                >
                    Bienvenido al Portal de Eventos UBB
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            startIcon={<Calendar />}
                            onClick={() => navigate('/calendar')}
                            sx={{
                                height: 80,
                                color: '#fff',
                                backgroundColor: UBB_COLORS.primary,
                                '&:hover': { backgroundColor: UBB_COLORS.primaryDark }
                            }}
                        >
                            Calendario Personal
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            startIcon={<List />}
                            onClick={() => navigate('/events')}
                            sx={{
                                height: 80,
                                color: '#fff',
                                backgroundColor: UBB_COLORS.primary,
                                '&:hover': { backgroundColor: UBB_COLORS.primaryDark }
                            }}
                        >
                            Eventos
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            startIcon={<User />}
                            onClick={() => navigate('/profile')}
                            sx={{
                                height: 80,
                                color: '#fff',
                                backgroundColor: UBB_COLORS.primary,
                                '&:hover': { backgroundColor: UBB_COLORS.primaryDark }
                            }}
                        >
                            Perfil
                        </Button>
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<LogOut />}
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </Button>
            </Container>
        </Box>
    );
};

export default Dashboard;
