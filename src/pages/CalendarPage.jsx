import React, { useEffect, useState } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Users,
    AlertCircle,
    CalendarX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import { UBB_COLORS } from '../styles/colors';
import { getUserIdFromToken } from '../utils/auth';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const CalendarPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [todayEvents, setTodayEvents] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            const uid = getUserIdFromToken(token);
            if (!uid) return;
            setUserId(uid);

            try {
                const [toAttend, created] = await Promise.all([
                    eventService.getEventsToAttend(uid),
                    eventService.getEventsByCreator(uid)
                ]);

                let eventsList = created || [];

                if (toAttend.eventIds && toAttend.eventIds.length > 0) {
                    const attendEvents = await eventService.getEventsByIds(toAttend.eventIds);
                    eventsList = [...eventsList, ...attendEvents];
                }

                const unique = [];
                const seen = new Set();
                for (const ev of eventsList) {
                    if (!seen.has(ev.id)) {
                        unique.push(ev);
                        seen.add(ev.id);
                    }
                }
                setEvents(unique);
            } catch (err) {
                console.error('Error fetching events', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        // Filtrar eventos del día actual
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayEvents = events.filter(event =>
            event.fechaInicio.split('T')[0] === dateStr
        );

        // Ordenar por hora de inicio
        dayEvents.sort((a, b) =>
            new Date(a.fechaInicio) - new Date(b.fechaInicio)
        );

        setTodayEvents(dayEvents);
    }, [currentDate, events]);

    const changeDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-CL', options);
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isPastEvent = (eventEndTime) => {
        return new Date(eventEndTime) < new Date();
    };

    const getHourPosition = (time) => {
        const date = new Date(time);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return (hours * 60 + minutes) / 1440 * 100; // Porcentaje del día
    };

    const getEventDuration = (start, end) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const duration = (endTime - startTime) / (1000 * 60); // Duración en minutos
        return duration / 1440 * 100; // Porcentaje del día
    };

    // Generar las 24 horas del día
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const refreshEvents = async () => {
        if (!userId) return;
        try {
            const [toAttend, created] = await Promise.all([
                eventService.getEventsToAttend(userId),
                eventService.getEventsByCreator(userId)
            ]);

            let eventsList = created || [];

            if (toAttend.eventIds && toAttend.eventIds.length > 0) {
                const attendEvents = await eventService.getEventsByIds(toAttend.eventIds);
                eventsList = [...eventsList, ...attendEvents];
            }

            const unique = [];
            const seen = new Set();
            for (const ev of eventsList) {
                if (!seen.has(ev.id)) {
                    unique.push(ev);
                    seen.add(ev.id);
                }
            }
            setEvents(unique);
        } catch (err) {
            console.error('Error fetching events', err);
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    const handleCancel = async () => {
        if (!selectedEvent) return;
        try {
            await eventService.cancelRegistration(selectedEvent.id, userId);
            await refreshEvents();
        } catch (err) {
            console.error('Error cancelling registration', err);
        } finally {
            setModalOpen(false);
            setSelectedEvent(null);
        }
    };

    const EventCard = ({ event, isPast }) => (
        <div
            style={{
                position: 'absolute',
                left: '120px',
                right: '20px',
                top: `${getHourPosition(event.fechaInicio)}%`,
                height: `${getEventDuration(event.fechaInicio, event.fechaFin)}%`,
                minHeight: '60px',
                backgroundColor: isPast ? '#e5e7eb' : `${UBB_COLORS.primary}15`,
                border: `2px solid ${isPast ? '#9ca3af' : UBB_COLORS.primary}`,
                borderRadius: '8px',
                padding: '12px',
                cursor: isPast ? 'default' : 'pointer',
                transition: 'all 0.2s',
                opacity: isPast ? 0.6 : 1,
                overflow: 'hidden'
            }}
            onClick={() => !isPast && handleEventClick(event)}
            onMouseEnter={(e) => {
                if (!isPast) {
                    e.currentTarget.style.transform = 'translateX(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isPast) {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }
            }}
        >
            <h4 style={{
                fontWeight: '600',
                color: isPast ? '#6b7280' : '#1f2937',
                marginBottom: '4px',
                fontSize: '14px'
            }}>
                {event.titulo}
            </h4>
            <div style={{ fontSize: '12px', color: isPast ? '#9ca3af' : '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <Clock size={12} />
                    <span>{formatTime(event.fechaInicio)} - {formatTime(event.fechaFin)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    <span>{event.lugar}</span>
                </div>
                {event.aforoMax && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Users size={12} />
                        <span>Aforo: {event.aforoMax}</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: `2px solid ${UBB_COLORS.primary}`,
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }} />
                    <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando calendario...</p>
                </div>
                <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Header */}
            <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '8px 12px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    fontSize: '14px',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <ChevronLeft size={20} />
                                Volver
                            </button>
                            <div style={{
                                width: '1px',
                                height: '24px',
                                backgroundColor: '#e5e7eb'
                            }} />
                            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                                Mi Calendario
                            </h1>
                        </div>

                        {/* Navegación de fechas */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => changeDate(-1)}
                                style={{
                                    padding: '8px',
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={() => setCurrentDate(new Date())}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: UBB_COLORS.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                Hoy
                            </button>

                            <button
                                onClick={() => changeDate(1)}
                                style={{
                                    padding: '8px',
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Fecha actual */}
            <div style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '20px 0',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textTransform: 'capitalize'
                }}>
                    {formatDate(currentDate)}
                </h2>
                {todayEvents.length > 0 && (
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>
                        {todayEvents.length} {todayEvents.length === 1 ? 'evento' : 'eventos'} programado{todayEvents.length === 1 ? '' : 's'}
                    </p>
                )}
            </div>

            {/* Contenido principal */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
                {todayEvents.length === 0 ? (
                    // No hay eventos
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '48px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <CalendarX size={64} style={{ margin: '0 auto', color: '#9ca3af' }} />
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginTop: '16px' }}>
                            No tienes eventos para este día
                        </h3>
                        <p style={{ color: '#6b7280', marginTop: '8px' }}>
                            Usa los botones de navegación para ver otros días o
                        </p>
                        <button
                            onClick={() => navigate('/events')}
                            style={{
                                marginTop: '16px',
                                padding: '12px 24px',
                                backgroundColor: UBB_COLORS.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Explorar eventos disponibles
                        </button>
                    </div>
                ) : (
                    // Vista de timeline
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        position: 'relative',
                        minHeight: '800px'
                    }}>
                        {/* Línea de tiempo */}
                        <div style={{ position: 'relative', height: '100%' }}>
                            {/* Horas del día */}
                            {hours.map(hour => (
                                <div
                                    key={hour}
                                    style={{
                                        position: 'absolute',
                                        top: `${(hour / 24) * 100}%`,
                                        left: 0,
                                        right: 0,
                                        borderTop: '1px solid #e5e7eb',
                                        height: '1px'
                                    }}
                                >
                  <span style={{
                      position: 'absolute',
                      left: '0',
                      top: '-10px',
                      fontSize: '12px',
                      color: '#9ca3af',
                      backgroundColor: 'white',
                      padding: '0 8px'
                  }}>
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                                </div>
                            ))}

                            {/* Línea del tiempo actual */}
                            {currentDate.toDateString() === new Date().toDateString() && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: `${getHourPosition(new Date().toISOString())}%`,
                                        left: '60px',
                                        right: '0',
                                        height: '2px',
                                        backgroundColor: UBB_COLORS.secondary,
                                        zIndex: 10
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        left: '-8px',
                                        top: '-4px',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: UBB_COLORS.secondary
                                    }} />
                                    <span style={{
                                        position: 'absolute',
                                        left: '-50px',
                                        top: '-8px',
                                        fontSize: '11px',
                                        color: UBB_COLORS.secondary,
                                        fontWeight: '600'
                                    }}>
                    {formatTime(new Date().toISOString())}
                  </span>
                                </div>
                            )}

                            {/* Eventos */}
                            {todayEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    isPast={isPastEvent(event.fechaFin)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Leyenda */}
                {todayEvents.length > 0 && (
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        fontSize: '14px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: `${UBB_COLORS.primary}15`,
                                border: `2px solid ${UBB_COLORS.primary}`,
                                borderRadius: '4px'
                            }} />
                            <span style={{ color: '#6b7280' }}>Evento próximo</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: '#e5e7eb',
                                border: '2px solid #9ca3af',
                                borderRadius: '4px',
                                opacity: 0.6
                            }} />
                            <span style={{ color: '#6b7280' }}>Evento pasado</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '32px',
                                height: '2px',
                                backgroundColor: UBB_COLORS.secondary
                            }} />
                            <span style={{ color: '#6b7280' }}>Hora actual</span>
                        </div>
                    </div>
                )}
            </div>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{selectedEvent?.titulo}</DialogTitle>
                <DialogContent dividers>
                    {selectedEvent && (
                        <div>
                            <p><strong>Descripción:</strong> {selectedEvent.descripcion}</p>
                            <p>
                                <strong>Fecha:</strong>{' '}
                                {new Date(selectedEvent.fechaInicio).toLocaleString()} -{' '}
                                {new Date(selectedEvent.fechaFin).toLocaleString()}
                            </p>
                            <p><strong>Lugar:</strong> {selectedEvent.lugar}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
                    <Button onClick={handleCancel} color="error" variant="contained">
                        Cancelar inscripción
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalendarPage;
