import React, { useEffect, useState } from 'react';
import {
    User,
    Calendar,
    ChevronRight,
    Trophy,
    Users,
    Mail,
    MapPin,
    CalendarCheck,
    CalendarPlus,
    Activity,
    ChevronLeft,
    Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UBB_COLORS } from '../styles/colors';
import userService from '../services/userService';
import { getUserIdFromToken } from '../utils/auth';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [trophies, setTrophies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            const userId = getUserIdFromToken(token);
            if (!userId) return;

            try {
                const [userData, summaryData] = await Promise.all([
                    userService.getUser(userId),
                    userService.getSummary(userId)
                ]);

                setUser(userData);
                setSummary(summaryData);

                if (summaryData.trophies && summaryData.trophies.length > 0) {
                    const trophyIds = summaryData.trophies.map(t =>
                        typeof t === 'number' ? t : t.id
                    );
                    const trophyData = await userService.getTrophies(trophyIds);
                    setTrophies(trophyData);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const avatarUrl = user?.fotoUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${user?.nombres || ''} ${user?.apellidos || ''}`
        )}&background=${UBB_COLORS.primary.slice(1)}&color=ffffff&size=200`;

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
                    <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando perfil...</p>
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
            <div style={{
                background: `linear-gradient(135deg, ${UBB_COLORS.primary} 0%, #1e40af 100%)`,
                color: 'white',
                paddingBottom: '32px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'rgba(255,255,255,0.8)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'white'}
                        onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
                    >
                        <ChevronLeft size={20} style={{ marginRight: '4px' }} />
                        Volver al Dashboard
                    </button>

                    <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', alignItems: window.innerWidth > 768 ? 'start' : 'center', gap: '24px' }}>
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            style={{
                                width: '128px',
                                height: '128px',
                                borderRadius: '50%',
                                border: '4px solid white',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                        />
                        <div style={{ textAlign: window.innerWidth > 768 ? 'left' : 'center' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                                {user ? `${user.nombres} ${user.apellidos}` : 'Cargando...'}
                            </h1>
                            <p style={{ fontSize: '20px', color: 'rgba(219,234,254,1)', marginBottom: '16px' }}>
                                @{summary?.username || user?.username}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: window.innerWidth > 768 ? 'start' : 'center', fontSize: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={16} />
                                    <span>{user?.correoUbb}</span>
                                </div>
                                {user?.campus && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={16} />
                                        <span>Campus {user.campus.nombre || user.campus}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Activity size={16} />
                                    <span style={{ textTransform: 'capitalize' }}>{user?.estado?.toLowerCase() || 'Activo'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'box-shadow 0.2s'
                    }}
                         onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
                         onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: `${UBB_COLORS.primary}15` }}>
                                <Users size={24} style={{ color: UBB_COLORS.primary }} />
                            </div>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {summary?.friendsCount || 0}
              </span>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Amigos en la comunidad</p>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'box-shadow 0.2s'
                    }}
                         onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
                         onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: `${UBB_COLORS.secondary}15` }}>
                                <CalendarCheck size={24} style={{ color: UBB_COLORS.secondary }} />
                            </div>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {summary?.events?.eventsAttended || 0}
              </span>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Eventos asistidos</p>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'box-shadow 0.2s'
                    }}
                         onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
                         onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#10b98115' }}>
                                <CalendarPlus size={24} style={{ color: '#10B981' }} />
                            </div>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {summary?.events?.eventsCreated || 0}
              </span>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Eventos creados</p>
                    </div>
                </div>

                {/* Trophies */}
                {trophies.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '32px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Star style={{ color: UBB_COLORS.yellow }} size={24} />
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Mis Logros</h2>
                            <span style={{
                                marginLeft: 'auto',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                {trophies.length} {trophies.length === 1 ? 'trofeo' : 'trofeos'}
              </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                            {trophies.map((trophy) => (
                                <div key={trophy.id} style={{
                                    background: 'linear-gradient(to bottom right, #fef3c7, #fde68a)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    textAlign: 'center',
                                    border: '1px solid #fcd34d'
                                }}>
                                    <Trophy size={32} style={{ margin: '0 auto 8px', color: UBB_COLORS.yellow }} />
                                    <h4 style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>{trophy.nombre}</h4>
                                    {trophy.descripcion && (
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{trophy.descripcion}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Actividad Reciente</h2>
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
                            Ver todos los eventos
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px',
                            backgroundColor: '#eff6ff',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <p style={{ fontWeight: '500', color: '#1f2937' }}>Eventos por asistir</p>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>Tienes eventos programados</p>
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: UBB_COLORS.primary }}>
                                {summary?.events?.eventsToAttend || 0}
                            </div>
                        </div>

                        {user?.roles && user.roles.length > 0 && (
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '8px'
                            }}>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '8px' }}>
                                    Tus roles en la plataforma:
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {user.roles.map((role, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                padding: '4px 12px',
                                                backgroundColor: 'white',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                color: '#4b5563',
                                                border: '1px solid #e5e7eb'
                                            }}
                                        >
                     {role.nombre || role}
                   </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;