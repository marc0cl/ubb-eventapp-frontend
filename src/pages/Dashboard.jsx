import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    CalendarDays,
    Users,
    User,
    LogOut,
    TrendingUp,
    Clock,
    MapPin,
    ChevronRight,
    Bell,
    Settings
} from 'lucide-react';
import authService from '../services/authService';
import eventService from '../services/eventService';
import userService from '../services/userService';
import { UBB_COLORS } from '../styles/colors';
import { getUserIdFromToken, getRoleFromToken } from '../utils/auth';
import ticketService from '../services/ticketService';

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [stats, setStats] = useState({
        eventsToAttend: 0,
        friendsCount: 0,
        eventsAttended: 0
    });
    const [ticketModal, setTicketModal] = useState(false);
    const [ticketDesc, setTicketDesc] = useState('');

    useEffect(() => {
        const loadDashboardData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const uid = getUserIdFromToken(token);
            if (!uid) return;
            setUserId(uid);
            setRole(getRoleFromToken(token));

            try {
                const [userData, summaryData, eventsData] = await Promise.all([
                    userService.getUser(uid),
                    userService.getSummary(uid),
                    eventService.getPublicEvents()
                ]);

                setUserName(userData.nombres);
                const createdCount = summaryData.events?.eventsCreated || 0;
                const toAttendCount = summaryData.events?.eventsToAttend || 0;
                setStats({
                    eventsToAttend: toAttendCount + createdCount,
                    friendsCount: summaryData.friendsCount || 0,
                    eventsAttended: summaryData.events?.eventsAttended || 0
                });

                setUpcomingEvents(eventsData.slice(0, 3));
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            if (onLogout) onLogout();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleCreateTicket = async () => {
        if (!ticketDesc.trim()) return;
        try {
            await ticketService.openTicket(ticketDesc, userId);
            setTicketDesc('');
            setTicketModal(false);
        } catch (err) {
            console.error('Error creating ticket', err);
        }
    };

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
                    <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando dashboard...</p>
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
                            <div style={{
                                padding: '8px',
                                borderRadius: '8px',
                                backgroundColor: UBB_COLORS.primary
                            }}>
                                <Calendar style={{ color: 'white' }} size={24} />
                            </div>
                            <div>
                                <h1 style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Eventos UBB</h1>
                                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Tu calendario universitario</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => setTicketModal(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: UBB_COLORS.primary,
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = UBB_COLORS.primary}
                            >
                                <span>Levantar Ticket</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: '8px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
                            >
                                <LogOut size={18} />
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
                {/* Welcome */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        ¡Hola, {userName || 'Usuario'}! 👋
                    </h2>
                    <p style={{ color: '#6b7280' }}>
                        Aquí está tu resumen de actividades en el campus
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${UBB_COLORS.primary} 0%, #1e40af 100%)`,
                        borderRadius: '12px',
                        padding: '24px',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <CalendarDays size={24} style={{ opacity: 0.8 }} />
                            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.eventsToAttend}</span>
                        </div>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>Eventos por asistir</p>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <TrendingUp size={24} style={{ opacity: 0.8 }} />
                            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.eventsAttended}</span>
                        </div>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>Eventos asistidos</p>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Users size={24} style={{ opacity: 0.8 }} />
                            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.friendsCount}</span>
                        </div>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>Amigos en la red</p>
                    </div>
                </div>

                {/* Quick actions */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Acceso rápido</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        {(() => {
                            const items = [
                                { icon: Calendar, title: 'Mi Calendario', desc: 'Ver todos mis eventos programados', path: '/calendar', color: UBB_COLORS.primary },
                                { icon: CalendarDays, title: 'Explorar Eventos', desc: 'Descubre nuevas actividades', path: '/events', color: UBB_COLORS.secondary },
                                { icon: User, title: 'Mi Perfil', desc: 'Ver logros y estadísticas', path: '/profile', color: '#8B5CF6' },
                                { icon: Users, title: 'Comunidad', desc: 'Conecta con otros estudiantes', path: '/friends', color: '#10B981' }
                            ];
                            if (role === 'MODERADOR' || role === 'ADMINISTRADOR') {
                                items.push({ icon: Settings, title: 'Tickets', desc: 'Gestionar reportes', path: '/tickets', color: UBB_COLORS.primary });
                            }
                            return items;
                        })().map((item, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: '1px solid #e5e7eb',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    width: '100%',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: `${item.color}15`
                                    }}>
                                        <item.icon size={24} style={{ color: item.color }} />
                                    </div>
                                    <ChevronRight size={20} style={{ color: '#9ca3af' }} />
                                </div>
                                <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{item.title}</h3>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>{item.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upcoming events */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr',
                    gap: '24px'
                }}>
                    <div style={{
                        backgroundColor: '#dbeafe',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #93c5fd'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px' }}>
                                <Bell style={{ color: '#2563eb' }} size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                                    Mantente conectado con la comunidad UBB
                                </h4>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                    No te pierdas ningún evento importante. Activa las notificaciones para recibir
                                    recordatorios de tus actividades programadas.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Próximos eventos</h3>
                            <button
                                onClick={() => navigate('/events')}
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: UBB_COLORS.primary,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                Ver todos
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {upcomingEvents.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {upcomingEvents.map(event => (
                                    <div key={event.id} style={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>{event.titulo}</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Clock size={14} />
                                                <span>{new Date(event.fechaInicio).toLocaleDateString('es-CL')}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <MapPin size={14} />
                                                <span>{event.lugar}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '24px',
                                textAlign: 'center',
                                border: '1px solid #e5e7eb'
                            }}>
                                <Calendar style={{ margin: '0 auto 12px', color: '#9ca3af' }} size={48} />
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>No hay eventos próximos</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {ticketModal && (
                <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={(e)=>{if(e.target===e.currentTarget)setTicketModal(false);}}>
                    <div style={{ background:'white', borderRadius:'8px', padding:'24px', width:'90%', maxWidth:'500px' }}>
                        <h2 style={{ fontWeight:'600', marginBottom:'12px' }}>Nuevo Ticket</h2>
                        <textarea value={ticketDesc} onChange={e=>setTicketDesc(e.target.value)} rows="4" style={{ width:'100%', border:'1px solid #e5e7eb', borderRadius:'6px', padding:'8px' }} />
                        <div style={{ display:'flex', justifyContent:'flex-end', gap:'8px', marginTop:'16px' }}>
                            <button onClick={()=>setTicketModal(false)} style={{ padding:'8px 16px', border:'none', borderRadius:'6px', background:'#e5e7eb', color:'#374151', cursor:'pointer' }}>Cancelar</button>
                            <button onClick={handleCreateTicket} style={{ padding:'8px 16px', border:'none', borderRadius:'6px', background:UBB_COLORS.primary, color:'white', cursor:'pointer' }}>Enviar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;