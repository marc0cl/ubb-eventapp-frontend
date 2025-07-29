import React, { useEffect, useState } from 'react';
import {
    Calendar,
    CalendarDays,
    Clock,
    MapPin,
    Users,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Eye,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    AlertCircle,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import { UBB_COLORS } from '../styles/colors';
import { getUserIdFromToken, getRoleFromToken } from '../utils/auth';

const EventsPage = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [registeredIds, setRegisteredIds] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        lugar: '',
        aforoMax: '',
        visibilidad: true,
        origenTipo: 'USUARIO'
    });
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const EVENTS_PER_PAGE = 12;

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
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
        primaryButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: UBB_COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        mainContent: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 16px'
        },
        tabContainer: {
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        tab: {
            flex: 1,
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center'
        },
        activeTab: {
            backgroundColor: UBB_COLORS.primary,
            color: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        inactiveTab: {
            backgroundColor: 'transparent',
            color: '#6b7280'
        },
        searchContainer: {
            position: 'relative',
            marginBottom: '24px'
        },
        searchInput: {
            width: '100%',
            padding: '12px 16px',
            paddingLeft: '44px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
            outline: 'none',
            backgroundColor: 'white'
        },
        searchIcon: {
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
        },
        eventsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
        },
        eventCard: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.2s',
            cursor: 'pointer'
        },
        eventCardHover: {
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            borderColor: '#d1d5db'
        },
        eventTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px',
            lineHeight: '1.3'
        },
        eventMeta: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#6b7280'
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            textAlign: 'center',
            marginBottom: '16px',
            display: 'inline-block'
        },
        pendingBadge: {
            backgroundColor: '#fef3c7',
            color: '#d97706',
            border: '1px solid #fcd34d'
        },
        approvedBadge: {
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            border: '1px solid #bbf7d0'
        },
        buttonGroup: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
        },
        secondaryButton: {
            padding: '8px 16px',
            backgroundColor: 'white',
            color: UBB_COLORS.primary,
            border: `1px solid ${UBB_COLORS.primary}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        successButton: {
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        dangerButton: {
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '32px'
        },
        paginationButton: {
            padding: '8px 12px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
        },
        activePage: {
            backgroundColor: UBB_COLORS.primary,
            color: 'white',
            borderColor: UBB_COLORS.primary
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb'
        },
        modalTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937'
        },
        closeButton: {
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'background-color 0.2s'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
            outline: 'none',
            boxSizing: 'border-box'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
            outline: 'none',
            resize: 'vertical',
            minHeight: '80px',
            boxSizing: 'border-box'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            boxSizing: 'border-box'
        },
        checkbox: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px'
        },
        modalActions: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
        },
        emptyState: {
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
        },
        emptyIcon: {
            margin: '0 auto 16px',
            color: '#9ca3af'
        },
        emptyTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px'
        },
        emptyText: {
            color: '#6b7280',
            fontSize: '14px'
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) return;
                const uid = getUserIdFromToken(token);
                const userRole = getRoleFromToken(token);
                setRole(userRole);
                setUserId(uid);

                const all = await eventService.getUpcomingEvents();
                setEvents(all.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)));
                setPage(1);

                if (uid) {
                    const mine = await eventService.getEventsByCreator(uid);
                    setMyEvents(mine);
                    const toAttend = await eventService.getEventsToAttend(uid);
                    setRegisteredIds(toAttend.eventIds || []);
                }
                if (userRole === 'MODERADOR' || userRole === 'ADMINISTRADOR') {
                    const pending = await eventService.getPendingEvents();
                    setPendingEvents(pending);
                }
            } catch (err) {
                console.error('Error fetching events', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const refreshAll = async () => {
        const all = await eventService.getUpcomingEvents();
        setEvents(all.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)));
        setPage(1);
        if (userId) {
            const mine = await eventService.getEventsByCreator(userId);
            setMyEvents(mine);
            const toAttend = await eventService.getEventsToAttend(userId);
            setRegisteredIds(toAttend.eventIds || []);
        }
        if (role === 'MODERADOR' || role === 'ADMINISTRADOR') {
            const pending = await eventService.getPendingEvents();
            setPendingEvents(pending);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                aforoMax: Number(formData.aforoMax),
                visibilidad: formData.visibilidad ? 'PUBLICO' : 'PRIVADO'
            };
            const withCreator = {
                ...data,
                creador: { id: userId }
            };
            if (editingId) {
                await eventService.updateEvent({
                    ...withCreator,
                    id: editingId
                });
            } else {
                await eventService.createEvent(withCreator);
            }
            setFormOpen(false);
            setFormData({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', lugar: '', aforoMax: '', visibilidad: true, origenTipo: 'USUARIO' });
            setEditingId(null);
            await refreshAll();
        } catch (err) {
            console.error('Error saving event', err);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            try {
                await eventService.deleteEvent(id);
                await refreshAll();
            } catch (err) {
                console.error('Error deleting event', err);
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await eventService.approveEvent(id);
            const pending = await eventService.getPendingEvents();
            setPendingEvents(pending);
            await refreshAll();
        } catch (err) {
            console.error('Error approving event', err);
        }
    };

    const handleRegister = async (id) => {
        if (!userId) return;
        try {
            await eventService.registerForEvent(id, userId);
            const toAttend = await eventService.getEventsToAttend(userId);
            setRegisteredIds(toAttend.eventIds || []);
        } catch (err) {
            console.error('Error registering', err);
        }
    };

    const handleCancel = async (id) => {
        if (!userId) return;
        try {
            await eventService.cancelRegistration(id, userId);
            const toAttend = await eventService.getEventsToAttend(userId);
            setRegisteredIds(toAttend.eventIds || []);
        } catch (err) {
            console.error('Error cancelling registration', err);
        }
    };

    const openForEdit = (ev) => {
        setEditingId(ev.id);
        setFormData({
            titulo: ev.titulo,
            descripcion: ev.descripcion,
            fechaInicio: ev.fechaInicio,
            fechaFin: ev.fechaFin,
            lugar: ev.lugar,
            aforoMax: ev.aforoMax,
            visibilidad: ev.visibilidad === 'PUBLICO',
            origenTipo: ev.origenTipo || 'USUARIO'
        });
        setFormOpen(true);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFilteredEvents = () => {
        let currentEvents = [];
        if (tab === 0) currentEvents = events;
        else if (tab === 1) currentEvents = myEvents;
        else if (tab === 2) currentEvents = pendingEvents;

        if (searchTerm) {
            currentEvents = currentEvents.filter(event =>
                event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.lugar.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return currentEvents;
    };

    const getPaginatedEvents = () => {
        const filtered = getFilteredEvents();
        const startIndex = (page - 1) * EVENTS_PER_PAGE;
        return filtered.slice(startIndex, startIndex + EVENTS_PER_PAGE);
    };

    const getTotalPages = () => {
        return Math.ceil(getFilteredEvents().length / EVENTS_PER_PAGE);
    };

    const EventCard = ({ event, editable, pending, registered, onEdit, onDelete, onApprove, onRegister, onCancel }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <div
                style={{
                    ...styles.eventCard,
                    ...(isHovered ? styles.eventCardHover : {})
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Status Badge */}
                {event.estadoValidacion === 'PENDIENTE' && (
                    <div style={{...styles.statusBadge, ...styles.pendingBadge}}>
                        <AlertCircle size={12} style={{ marginRight: '4px', display: 'inline' }} />
                        Pendiente de aprobación
                    </div>
                )}

                {/* Event Title */}
                <h3 style={styles.eventTitle}>{event.titulo}</h3>

                {/* Event Meta */}
                <div style={styles.eventMeta}>
                    <div style={styles.metaItem}>
                        <Calendar size={16} />
                        <span>{formatDate(event.fechaInicio)}</span>
                    </div>
                    <div style={styles.metaItem}>
                        <Clock size={16} />
                        <span>{formatTime(event.fechaInicio)} - {formatTime(event.fechaFin)}</span>
                    </div>
                    <div style={styles.metaItem}>
                        <MapPin size={16} />
                        <span>{event.lugar}</span>
                    </div>
                    {event.aforoMax && (
                        <div style={styles.metaItem}>
                            <Users size={16} />
                            <span>Capacidad: {event.aforoMax} personas</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {event.descripcion && (
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '16px',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {event.descripcion}
                    </p>
                )}

                {/* Action Buttons */}
                <div style={styles.buttonGroup}>
                    {pending && (
                        <button
                            onClick={() => onApprove(event.id)}
                            style={styles.successButton}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            <CheckCircle size={14} style={{ marginRight: '4px' }} />
                            Aprobar
                        </button>
                    )}
                    {editable && (
                        <>
                            <button
                                onClick={() => onEdit(event)}
                                style={styles.secondaryButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = `${UBB_COLORS.primary}10`}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                <Edit size={14} style={{ marginRight: '4px' }} />
                                Editar
                            </button>
                            <button
                                onClick={() => onDelete(event.id)}
                                style={styles.dangerButton}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                <Trash2 size={14} style={{ marginRight: '4px' }} />
                                Eliminar
                            </button>
                        </>
                    )}
                    {!editable && !pending && (
                        registered ? (
                            <button
                                onClick={() => onCancel(event.id)}
                                style={styles.dangerButton}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                <XCircle size={14} style={{ marginRight: '4px' }} />
                                Cancelar Inscripción
                            </button>
                        ) : (
                            <button
                                onClick={() => onRegister(event.id)}
                                style={styles.successButton}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                <CheckCircle size={14} style={{ marginRight: '4px' }} />
                                Inscribirse
                            </button>
                        )
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
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
                        <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando eventos...</p>
                    </div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={styles.backButton}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <ChevronLeft size={20} />
                            Volver
                        </button>
                        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }} />
                        <h1 style={styles.title}>Eventos</h1>
                    </div>

                    <button
                        onClick={() => setFormOpen(true)}
                        style={styles.primaryButton}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = UBB_COLORS.primaryDark;
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = UBB_COLORS.primary;
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <Plus size={20} />
                        Crear Evento
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {/* Tabs */}
                <div style={styles.tabContainer}>
                    <button
                        onClick={() => {setTab(0); setPage(1);}}
                        style={{
                            ...styles.tab,
                            ...(tab === 0 ? styles.activeTab : styles.inactiveTab)
                        }}
                    >
                        <CalendarDays size={16} style={{ marginRight: '6px' }} />
                        Todos los eventos
                    </button>
                    <button
                        onClick={() => {setTab(1); setPage(1);}}
                        style={{
                            ...styles.tab,
                            ...(tab === 1 ? styles.activeTab : styles.inactiveTab)
                        }}
                    >
                        <User size={16} style={{ marginRight: '6px' }} />
                        Mis eventos
                    </button>
                    {(role === 'MODERADOR' || role === 'ADMINISTRADOR') && (
                        <button
                            onClick={() => {setTab(2); setPage(1);}}
                            style={{
                                ...styles.tab,
                                ...(tab === 2 ? styles.activeTab : styles.inactiveTab)
                            }}
                        >
                            <AlertCircle size={16} style={{ marginRight: '6px' }} />
                            Por validar ({pendingEvents.length})
                        </button>
                    )}
                </div>

                {/* Search */}
                <div style={styles.searchContainer}>
                    <Search style={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Buscar eventos por título o lugar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                        onFocus={(e) => {
                            e.target.style.borderColor = UBB_COLORS.primary;
                            e.target.style.boxShadow = `0 0 0 3px ${UBB_COLORS.primary}20`;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Events Grid */}
                {getPaginatedEvents().length > 0 ? (
                    <>
                        <div style={styles.eventsGrid}>
                            {getPaginatedEvents().map((ev) => (
                                <EventCard
                                    key={ev.id}
                                    event={ev}
                                    editable={
                                        (tab === 1) ||
                                        (role === 'ADMINISTRADOR')
                                    }
                                    pending={tab === 2}
                                    registered={registeredIds.includes(ev.id)}
                                    onEdit={openForEdit}
                                    onDelete={handleDelete}
                                    onApprove={handleApprove}
                                    onRegister={handleRegister}
                                    onCancel={handleCancel}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {getTotalPages() > 1 && (
                            <div style={styles.pagination}>
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    style={{
                                        ...styles.paginationButton,
                                        opacity: page === 1 ? 0.5 : 1,
                                        cursor: page === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        style={{
                                            ...styles.paginationButton,
                                            ...(page === pageNum ? styles.activePage : {})
                                        }}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === getTotalPages()}
                                    style={{
                                        ...styles.paginationButton,
                                        opacity: page === getTotalPages() ? 0.5 : 1,
                                        cursor: page === getTotalPages() ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty States */
                    <div style={styles.emptyState}>
                        {tab === 0 && (
                            <>
                                <CalendarDays style={styles.emptyIcon} size={64} />
                                <h3 style={styles.emptyTitle}>
                                    {searchTerm ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
                                </h3>
                                <p style={styles.emptyText}>
                                    {searchTerm
                                        ? 'Intenta con otros términos de búsqueda'
                                        : 'Aún no hay eventos programados. ¡Sé el primero en crear uno!'
                                    }
                                </p>
                            </>
                        )}
                        {tab === 1 && (
                            <>
                                <User style={styles.emptyIcon} size={64} />
                                <h3 style={styles.emptyTitle}>No has creado eventos</h3>
                                <p style={styles.emptyText}>
                                    Comienza creando tu primer evento y compártelo con la comunidad UBB
                                </p>
                            </>
                        )}
                        {tab === 2 && (
                            <>
                                <CheckCircle style={styles.emptyIcon} size={64} />
                                <h3 style={styles.emptyTitle}>No hay eventos por validar</h3>
                                <p style={styles.emptyText}>
                                    Todos los eventos están aprobados y publicados
                                </p>
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Modal para crear/editar evento */}
            {formOpen && (
                <div style={styles.modal} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setFormOpen(false);
                        setEditingId(null);
                    }
                }}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                {editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}
                            </h2>
                            <button
                                onClick={() => {
                                    setFormOpen(false);
                                    setEditingId(null);
                                }}
                                style={styles.closeButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrUpdate}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Título del evento *</label>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    style={styles.input}
                                    placeholder="Ej: Conferencia de Tecnología"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = UBB_COLORS.primary;
                                        e.target.style.boxShadow = `0 0 0 3px ${UBB_COLORS.primary}20`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Descripción</label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    style={styles.textarea}
                                    placeholder="Describe de qué se trata el evento..."
                                    onFocus={(e) => {
                                        e.target.style.borderColor = UBB_COLORS.primary;
                                        e.target.style.boxShadow = `0 0 0 3px ${UBB_COLORS.primary}20`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Fecha y hora de inicio *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.fechaInicio}
                                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                        style={styles.input}
                                        required
                                        onFocus={(e) => {
                                            e.target.style.borderColor = UBB_COLORS.primary;
                                            e.target.style.boxShadow = `0 0 0 3px ${UBB_COLORS.primary}20`;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#d1d5db';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Fecha y hora de fin *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.fechaFin}
                                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                        style={styles.input}
                                        required
                                        onFocus={(e) => {
                                            e.target.style.borderColor = UBB_COLORS.primary;
                                            e.target.style.boxShadow = `0 0 0 3px ${UBB_COLORS.primary}20`;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#d1d5db';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Lugar *</label>
                                <input
                                    type="text"
                                    value={formData.lugar}
                                    onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                                    style={styles.input}
                                    placeholder="Ej: Aula Magna, Campus Concepción"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = UBB_COLORS.primary;
                                        e.target.style.boxShadow = `0 0 0 3px ${UBB_COLORS.primary}20`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Capacidad máxima</label>
                                    <input
                                        type="number"
                                        value={formData.aforoMax}
                                        onChange={(e) => setFormData({ ...formData, aforoMax: e.target.value })}
                                        style={styles.input}
                                        placeholder="100"
                                        min="1"
                                        onFocus={(e) => {
                                            e.target.style.borderColor = UBB_COLORS.primary;
                                            e.target.style.boxShadow = `0 0 0 3px ${UBB_COLORS.primary}20`;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#d1d5db';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Tipo de origen</label>
                                    <select
                                        value={formData.origenTipo}
                                        onChange={(e) => setFormData({ ...formData, origenTipo: e.target.value })}
                                        style={styles.select}
                                    >
                                        <option value="USUARIO">Usuario</option>
                                        <option value="GRUPO">Grupo</option>
                                        <option value="OTRO">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    id="visibilidad"
                                    checked={formData.visibilidad}
                                    onChange={(e) => setFormData({ ...formData, visibilidad: e.target.checked })}
                                    style={{ accentColor: UBB_COLORS.primary }}
                                />
                                <label htmlFor="visibilidad" style={{ fontSize: '14px', color: '#374151' }}>
                                    Evento público (visible para todos los usuarios)
                                </label>
                            </div>

                            <div style={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormOpen(false);
                                        setEditingId(null);
                                    }}
                                    style={{
                                        ...styles.secondaryButton,
                                        padding: '12px 24px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = `${UBB_COLORS.primary}10`}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        ...styles.primaryButton,
                                        padding: '12px 24px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = UBB_COLORS.primaryDark;
                                        e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = UBB_COLORS.primary;
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {editingId ? 'Actualizar Evento' : 'Crear Evento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;