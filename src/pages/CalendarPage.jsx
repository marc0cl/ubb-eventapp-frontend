import React, { useEffect, useState } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Users,
    AlertCircle,
    CalendarX,
    X
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
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    // Estilos basados en las especificaciones
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f9fafb'
        },
        header: {
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderBottom: '1px solid #e5e7eb'
        },
        headerContent: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px'
        },
        backButton: {
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
        },
        title: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937'
        },
        navContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        navButton: {
            padding: '8px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        todayButton: {
            padding: '8px 16px',
            backgroundColor: UBB_COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'opacity 0.2s'
        },
        dateHeader: {
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '20px 0',
            textAlign: 'center'
        },
        dateTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            textTransform: 'capitalize',
            marginBottom: '4px'
        },
        eventCount: {
            color: '#6b7280',
            fontSize: '14px'
        },
        mainContent: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 16px'
        },
        timelineContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            position: 'relative',
            height: '800px', // Fixed height instead of minHeight
            overflow: 'hidden'
        },
        timelineContent: {
            position: 'relative',
            height: '100%',
            padding: '16px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        hourLine: {
            position: 'absolute',
            left: '0',
            right: '0',
            borderTop: '1px solid #f3f4f6',
            height: '1px'
        },
        hourLabel: {
            position: 'absolute',
            left: '12px',
            top: '-10px',
            fontSize: '12px',
            color: '#9ca3af',
            backgroundColor: 'white',
            padding: '0 8px',
            fontWeight: '500'
        },
        currentTimeLine: {
            position: 'absolute',
            left: '80px',
            right: '16px',
            height: '2px',
            backgroundColor: UBB_COLORS.secondary,
            zIndex: 10,
            borderRadius: '1px'
        },
        currentTimeCircle: {
            position: 'absolute',
            left: '-6px',
            top: '-4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: UBB_COLORS.secondary
        },
        currentTimeLabel: {
            position: 'absolute',
            left: '-60px',
            top: '-8px',
            fontSize: '11px',
            color: UBB_COLORS.secondary,
            fontWeight: '600',
            backgroundColor: 'white',
            padding: '0 4px'
        },
        eventCard: {
            position: 'absolute',
            backgroundColor: `${UBB_COLORS.primary}08`,
            border: `1px solid ${UBB_COLORS.primary}30`,
            borderLeft: `4px solid ${UBB_COLORS.primary}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '40px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        },
        eventCardHover: {
            transform: 'translateX(-4px)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            backgroundColor: `${UBB_COLORS.primary}12`
        },
        pastEventCard: {
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            borderLeftColor: '#9ca3af',
            opacity: 0.7,
            cursor: 'default'
        },
        eventTitle: {
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '2px',
            fontSize: '14px',
            lineHeight: '1.2',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        eventMeta: {
            fontSize: '12px',
            color: '#6b7280',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        emptyState: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
        },
        emptyIcon: {
            margin: '0 auto',
            color: '#9ca3af',
            marginBottom: '16px'
        },
        emptyTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px'
        },
        emptyText: {
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '16px'
        },
        exploreButton: {
            padding: '12px 24px',
            backgroundColor: UBB_COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
        },
        legend: {
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '14px',
            border: '1px solid #e2e8f0'
        },
        legendItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        legendColor: {
            width: '16px',
            height: '16px',
            borderRadius: '4px'
        },
        loadingContainer: {
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        spinner: {
            width: '48px',
            height: '48px',
            border: `2px solid ${UBB_COLORS.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
        },
        // Calendar picker styles
        calendarModal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        calendarContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            padding: '24px',
            minWidth: '300px'
        },
        calendarHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
        },
        calendarTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937'
        },
        closeButton: {
            padding: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            color: '#6b7280'
        },
        monthNav: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between',
            marginBottom: '16px'
        },
        monthNavButton: {
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
            color: '#374151',
            transition: 'background-color 0.2s'
        },
        monthTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            textAlign: 'center',
            flex: 1
        },
        calendarGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px'
        },
        dayHeader: {
            padding: '8px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#6b7280',
            textAlign: 'center'
        },
        dayCell: {
            padding: '8px',
            fontSize: '14px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'all 0.2s',
            position: 'relative',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        dayDefault: {
            color: '#374151',
            backgroundColor: 'transparent'
        },
        daySelected: {
            backgroundColor: UBB_COLORS.primary,
            color: 'white',
            fontWeight: '600'
        },
        dayToday: {
            backgroundColor: '#dbeafe',
            color: UBB_COLORS.primary,
            fontWeight: '600'
        },
        dayOtherMonth: {
            color: '#d1d5db'
        },
        dayWithEvents: {
            backgroundColor: '#ecfdf5',
            color: '#059669',
            fontWeight: '500'
        },
        eventDot: {
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            backgroundColor: '#059669',
            borderRadius: '50%'
        }
    };

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
        const totalMinutes = hours * 60 + minutes;
        // Distribute over 16 hours (6 AM to 10 PM) for better spacing
        const startHour = 6;
        const endHour = 22;
        const visibleHours = endHour - startHour;
        const adjustedMinutes = Math.max(0, totalMinutes - (startHour * 60));
        return Math.min(100, (adjustedMinutes / (visibleHours * 60)) * 100);
    };

    const getEventDuration = (start, end) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const duration = (endTime - startTime) / (1000 * 60); // Duración en minutos
        const visibleMinutes = 16 * 60; // 16 hours visible
        return Math.min(25, (duration / visibleMinutes) * 100); // Max 25% height
    };

    // Generate visible hours (6 AM to 10 PM)
    const visibleHours = Array.from({ length: 17 }, (_, i) => i + 6);

    // Calculate event columns to handle overlapping events
    const calculateEventColumns = (events) => {
        const sortedEvents = [...events].sort((a, b) =>
            new Date(a.fechaInicio) - new Date(b.fechaInicio)
        );

        const columns = [];

        sortedEvents.forEach(event => {
            let placed = false;
            const eventStart = new Date(event.fechaInicio).getTime();
            const eventEnd = new Date(event.fechaFin).getTime();

            // Try to place in existing columns
            for (let i = 0; i < columns.length; i++) {
                const lastEventInColumn = columns[i][columns[i].length - 1];
                const lastEventEnd = new Date(lastEventInColumn.fechaFin).getTime();

                if (lastEventEnd <= eventStart) {
                    columns[i].push(event);
                    placed = true;
                    break;
                }
            }

            // Create new column if needed
            if (!placed) {
                columns.push([event]);
            }
        });

        // Assign column info to events
        const eventsWithColumns = [];
        columns.forEach((column, columnIndex) => {
            column.forEach(event => {
                eventsWithColumns.push({
                    ...event,
                    column: columnIndex,
                    totalColumns: columns.length
                });
            });
        });

        return eventsWithColumns;
    };

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

    // Calendar picker functions
    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event =>
            event.fechaInicio.split('T')[0] === dateStr
        );
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add days from previous month
        const prevMonth = new Date(year, month - 1, 0);
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonth.getDate() - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonth.getDate() - i)
            });
        }

        // Add days from current month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                date: new Date(year, month, day)
            });
        }

        // Add days from next month to complete the grid
        const remainingCells = 42 - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(year, month + 1, day)
            });
        }

        return days;
    };

    const handleDateSelect = (date) => {
        setCurrentDate(date);
        setCalendarOpen(false);
    };

    const EventCard = ({ event, isPast, column, totalColumns }) => {
        const [isHovered, setIsHovered] = useState(false);

        // Calculate width and position based on columns
        const width = `calc((100% - 88px) / ${totalColumns} - 8px)`;
        const left = `calc(88px + (100% - 88px) * ${column} / ${totalColumns} + 4px)`;

        return (
            <div
                style={{
                    ...styles.eventCard,
                    ...(isPast ? styles.pastEventCard : {}),
                    ...(isHovered && !isPast ? styles.eventCardHover : {}),
                    top: `${getHourPosition(event.fechaInicio)}%`,
                    height: `${Math.max(60, getEventDuration(event.fechaInicio, event.fechaFin))}px`,
                    left: left,
                    right: 'auto',
                    width: width,
                    zIndex: isHovered ? 20 : 5
                }}
                onClick={() => !isPast && handleEventClick(event)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <h4 style={{
                    ...styles.eventTitle,
                    color: isPast ? '#6b7280' : '#1f2937',
                    fontSize: totalColumns > 2 ? '12px' : '14px'
                }}>
                    {event.titulo}
                </h4>
                <div style={{
                    ...styles.eventMeta,
                    color: isPast ? '#9ca3af' : '#6b7280'
                }}>
                    <div style={styles.metaItem}>
                        <Clock size={totalColumns > 2 ? 10 : 12} />
                        <span style={{ fontSize: totalColumns > 2 ? '11px' : '12px' }}>
                            {formatTime(event.fechaInicio)} - {formatTime(event.fechaFin)}
                        </span>
                    </div>
                    {totalColumns <= 2 && (
                        <>
                            <div style={styles.metaItem}>
                                <MapPin size={12} />
                                <span style={{ fontSize: '12px' }}>{event.lugar}</span>
                            </div>
                            {event.aforoMax && (
                                <div style={styles.metaItem}>
                                    <Users size={12} />
                                    <span style={{ fontSize: '12px' }}>Aforo: {event.aforoMax}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{ textAlign: 'center' }}>
                    <div style={styles.spinner} />
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
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={styles.backButton}
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
                        <h1 style={styles.title}>Mi Calendario</h1>
                    </div>

                    {/* Navegación de fechas */}
                    <div style={styles.navContainer}>
                        <button
                            onClick={() => changeDate(-1)}
                            style={styles.navButton}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            onClick={() => setCalendarOpen(true)}
                            style={styles.todayButton}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Calendario
                        </button>

                        <button
                            onClick={() => changeDate(1)}
                            style={styles.navButton}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Fecha actual */}
            <div style={styles.dateHeader}>
                <h2 style={styles.dateTitle}>
                    {formatDate(currentDate)}
                </h2>
                {todayEvents.length > 0 && (
                    <p style={styles.eventCount}>
                        {todayEvents.length} {todayEvents.length === 1 ? 'evento' : 'eventos'} programado{todayEvents.length === 1 ? '' : 's'}
                    </p>
                )}
            </div>

            {/* Contenido principal */}
            <div style={styles.mainContent}>
                {todayEvents.length === 0 ? (
                    // No hay eventos
                    <div style={styles.emptyState}>
                        <CalendarX style={styles.emptyIcon} size={64} />
                        <h3 style={styles.emptyTitle}>
                            No tienes eventos para este día
                        </h3>
                        <p style={styles.emptyText}>
                            Usa los botones de navegación para ver otros días o explora eventos disponibles
                        </p>
                        <button
                            onClick={() => navigate('/events')}
                            style={styles.exploreButton}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Explorar eventos disponibles
                        </button>
                    </div>
                ) : (
                    // Vista de timeline mejorada
                    <div style={styles.timelineContainer}>
                        <div style={styles.timelineContent}>
                            {/* Líneas de horas */}
                            {visibleHours.map((hour, index) => (
                                <div
                                    key={hour}
                                    style={{
                                        ...styles.hourLine,
                                        top: `${(index / (visibleHours.length - 1)) * 100}%`
                                    }}
                                >
                                    <span style={styles.hourLabel}>
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}

                            {/* Línea del tiempo actual */}
                            {currentDate.toDateString() === new Date().toDateString() && (
                                <div
                                    style={{
                                        ...styles.currentTimeLine,
                                        top: `${getHourPosition(new Date().toISOString())}%`
                                    }}
                                >
                                    <div style={styles.currentTimeCircle} />
                                    <span style={styles.currentTimeLabel}>
                                        {formatTime(new Date().toISOString())}
                                    </span>
                                </div>
                            )}

                            {/* Eventos */}
                            {(() => {
                                const eventsWithColumns = calculateEventColumns(todayEvents);
                                return eventsWithColumns.map(event => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        isPast={isPastEvent(event.fechaFin)}
                                        column={event.column}
                                        totalColumns={event.totalColumns}
                                    />
                                ));
                            })()}
                        </div>
                    </div>
                )}

                {/* Leyenda */}
                {todayEvents.length > 0 && (
                    <div style={styles.legend}>
                        <div style={styles.legendItem}>
                            <div style={{
                                ...styles.legendColor,
                                backgroundColor: `${UBB_COLORS.primary}08`,
                                border: `1px solid ${UBB_COLORS.primary}30`,
                                borderLeft: `4px solid ${UBB_COLORS.primary}`
                            }} />
                            <span style={{ color: '#6b7280' }}>Evento próximo</span>
                        </div>
                        <div style={styles.legendItem}>
                            <div style={{
                                ...styles.legendColor,
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderLeft: '4px solid #9ca3af',
                                opacity: 0.7
                            }} />
                            <span style={{ color: '#6b7280' }}>Evento pasado</span>
                        </div>
                        <div style={styles.legendItem}>
                            <div style={{
                                width: '32px',
                                height: '2px',
                                backgroundColor: UBB_COLORS.secondary,
                                borderRadius: '1px'
                            }} />
                            <span style={{ color: '#6b7280' }}>Hora actual</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Calendar Picker Modal */}
            {calendarOpen && (
                <div
                    style={styles.calendarModal}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setCalendarOpen(false);
                        }
                    }}
                >
                    <div style={styles.calendarContainer}>
                        <div style={styles.calendarHeader}>
                            <h3 style={styles.calendarTitle}>Seleccionar fecha</h3>
                            <button
                                onClick={() => setCalendarOpen(false)}
                                style={styles.closeButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={styles.monthNav}>
                            <button
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                                style={styles.monthNavButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div style={styles.monthTitle}>
                                {viewDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                            </div>

                            <button
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                                style={styles.monthNavButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div style={styles.calendarGrid}>
                            {/* Day headers */}
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                <div key={day} style={styles.dayHeader}>
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {getDaysInMonth(viewDate).map((dayInfo, index) => {
                                const isSelected = dayInfo.date.toDateString() === currentDate.toDateString();
                                const isToday = dayInfo.date.toDateString() === new Date().toDateString();
                                const hasEvents = getEventsForDate(dayInfo.date).length > 0;

                                let dayStyle = { ...styles.dayCell };

                                if (isSelected) {
                                    dayStyle = { ...dayStyle, ...styles.daySelected };
                                } else if (isToday) {
                                    dayStyle = { ...dayStyle, ...styles.dayToday };
                                } else if (hasEvents && dayInfo.isCurrentMonth) {
                                    dayStyle = { ...dayStyle, ...styles.dayWithEvents };
                                } else if (!dayInfo.isCurrentMonth) {
                                    dayStyle = { ...dayStyle, ...styles.dayOtherMonth };
                                } else {
                                    dayStyle = { ...dayStyle, ...styles.dayDefault };
                                }

                                return (
                                    <div
                                        key={index}
                                        style={dayStyle}
                                        onClick={() => handleDateSelect(dayInfo.date)}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.target.style.backgroundColor = '#f3f4f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                if (isToday) {
                                                    e.target.style.backgroundColor = '#dbeafe';
                                                } else if (hasEvents && dayInfo.isCurrentMonth) {
                                                    e.target.style.backgroundColor = '#ecfdf5';
                                                } else {
                                                    e.target.style.backgroundColor = 'transparent';
                                                }
                                            }
                                        }}
                                    >
                                        {dayInfo.day}
                                        {hasEvents && dayInfo.isCurrentMonth && !isSelected && (
                                            <div style={styles.eventDot} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                            Los días con eventos están resaltados en verde
                        </div>
                    </div>
                </div>
            )}

            {/* Event Detail Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '16px'
                }}>
                    {selectedEvent?.titulo}
                </DialogTitle>
                <DialogContent dividers style={{ padding: '24px' }}>
                    {selectedEvent && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <p style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                    Descripción
                                </p>
                                <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
                                    {selectedEvent.descripcion || 'Sin descripción disponible'}
                                </p>
                            </div>

                            <div>
                                <p style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                    Fecha y hora
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                    <Clock size={16} />
                                    <span>
                                        {new Date(selectedEvent.fechaInicio).toLocaleDateString('es-CL', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginTop: '4px' }}>
                                    <div style={{ width: '16px' }} />
                                    <span>
                                        {formatTime(selectedEvent.fechaInicio)} - {formatTime(selectedEvent.fechaFin)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                    Ubicación
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                    <MapPin size={16} />
                                    <span>{selectedEvent.lugar}</span>
                                </div>
                            </div>

                            {selectedEvent.aforoMax && (
                                <div>
                                    <p style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                        Capacidad
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                        <Users size={16} />
                                        <span>{selectedEvent.aforoMax} personas</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions style={{ padding: '16px 24px' }}>
                    <Button
                        onClick={() => setModalOpen(false)}
                        style={{
                            color: '#6b7280',
                            textTransform: 'none',
                            fontWeight: '500'
                        }}
                    >
                        Cerrar
                    </Button>
                    <Button
                        onClick={handleCancel}
                        color="error"
                        variant="contained"
                        style={{
                            textTransform: 'none',
                            fontWeight: '500',
                            backgroundColor: '#dc2626'
                        }}
                    >
                        Cancelar inscripción
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalendarPage;