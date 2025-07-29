import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';
import eventService from '../services/eventService';
import { UBB_COLORS } from '../styles/colors';
import { getUserIdFromToken } from '../utils/auth';

const CalendarPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            const userId = getUserIdFromToken(token);
            if (!userId) return;
            try {
                const toAttend = await eventService.getEventsToAttend(userId);
                if (toAttend.eventIds && toAttend.eventIds.length > 0) {
                    const data = await eventService.getEventsByIds(toAttend.eventIds);
                    setEvents(data);
                }
            } catch (err) {
                console.error('Error fetching events', err);
            }
        };
        fetchEvents();
    }, []);

    const grouped = events.reduce((acc, ev) => {
        const date = ev.fechaInicio.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(ev);
        return acc;
    }, {});

    const dates = Object.keys(grouped).sort();

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: UBB_COLORS.primary }}>
                Calendario Personal
            </Typography>
            {dates.length === 0 ? (
                <Typography>No tienes eventos registrados.</Typography>
            ) : (
                dates.map((date) => (
                    <div key={date}>
                        <Typography variant="h6" sx={{ mt: 3, mb: 1, color: UBB_COLORS.primaryDark }}>
                            {new Date(date).toLocaleDateString()}
                        </Typography>
                        {grouped[date].map((ev) => (
                            <Card key={ev.id} sx={{ mb: 2, backgroundColor: '#f7f7f7' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ color: UBB_COLORS.primary }}>
                                        {ev.titulo}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(ev.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {' - '}
                                        {new Date(ev.fechaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                    <Typography variant="body2">{ev.lugar}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ))
            )}
        </Container>
    );
};

export default CalendarPage;
