import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Avatar,
    Grid,
    Card,
    CardContent,
    Box
} from '@mui/material';
import { Users, Trophy, CalendarCheck } from 'lucide-react';
import { UBB_COLORS } from '../styles/colors';
import userService from '../services/userService';

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [trophies, setTrophies] = useState([]);

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            const payload = parseJwt(token);
            const userId = payload?.id || payload?.userId || payload?.sub;
            if (!userId) return;
            try {
                const usr = await userService.getUser(userId);
                setUser(usr);
                const sum = await userService.getSummary(userId);
                setSummary(sum);
                if (sum.trophies && sum.trophies.length > 0) {
                    const ids = sum.trophies.map((t) => (typeof t === 'number' ? t : t.id));
                    const tro = await userService.getTrophies(ids);
                    setTrophies(tro);
                }
            } catch (err) {
                console.error('Error fetching profile', err);
            }
        };
        load();
    }, []);

    const avatarUrl = user?.fotoUrl
        ? user.fotoUrl
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              (user?.nombres || '') + ' ' + (user?.apellidos || '')
          )}&background=014898&color=ffffff`;

    return (
        <Container sx={{ py: 4 }}>
            <Box textAlign="center">
                <Avatar
                    src={avatarUrl}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h5" sx={{ color: UBB_COLORS.primary }}>
                    {user ? `${user.nombres} ${user.apellidos}` : ''}
                </Typography>
                <Typography variant="subtitle1">@{summary?.username}</Typography>
            </Box>

            <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', backgroundColor: '#f7f7f7' }}>
                        <CardContent>
                            <Users size={32} color={UBB_COLORS.primary} />
                            <Typography variant="h6">
                                {summary?.friendsCount || 0}
                            </Typography>
                            <Typography variant="body2">Amigos</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', backgroundColor: '#f7f7f7' }}>
                        <CardContent>
                            <CalendarCheck size={32} color={UBB_COLORS.primary} />
                            <Typography variant="h6">
                                {summary?.events?.eventsAttended || 0}
                            </Typography>
                            <Typography variant="body2">Eventos Asistidos</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', backgroundColor: '#f7f7f7' }}>
                        <CardContent>
                            <Trophy size={32} color={UBB_COLORS.primary} />
                            <Typography variant="h6">{trophies.length}</Typography>
                            <Typography variant="body2">Trofeos</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {trophies.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography
                        variant="h6"
                        sx={{ color: UBB_COLORS.primary, mb: 2 }}
                    >
                        Mis Trofeos
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {trophies.map((t) => (
                            <Grid item key={t.id}>
                                <Card
                                    sx={{
                                        p: 1,
                                        textAlign: 'center',
                                        backgroundColor: '#fffbe6'
                                    }}
                                >
                                    <Trophy size={24} color={UBB_COLORS.yellow} />
                                    <Typography variant="body2">
                                        {t.nombre || t.name}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default ProfilePage;
