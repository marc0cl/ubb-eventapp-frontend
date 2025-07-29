import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  ChevronLeft,
  User,
  Mail,
  MessageCircle,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { getUserIdFromToken } from '../utils/auth';
import { UBB_COLORS } from '../styles/colors';

const FriendsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [pending, setPending] = useState([]);
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Estilos basados en las especificaciones UBB
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
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
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
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    userCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s',
      marginBottom: '16px'
    },
    userCardHover: {
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
      borderColor: '#d1d5db'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px'
    },
    avatar: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: UBB_COLORS.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    },
    userDetails: {
      flex: 1
    },
    userName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '4px'
    },
    userUsername: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    userMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '12px',
      color: '#9ca3af'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: UBB_COLORS.primary,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    successButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
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
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
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
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: 'white',
      color: '#6b7280',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
      fontSize: '14px',
      lineHeight: '1.5'
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
    pendingBadge: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: '#fef3c7',
      color: '#d97706',
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: '500',
      border: '1px solid #fcd34d'
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const uid = getUserIdFromToken(token);
        if (!uid) return;
        setUserId(uid);

        const [rec, pend, fr] = await Promise.all([
          userService.getRecommendations(uid),
          userService.getPendingFriendRequests(uid),
          userService.getFriends(uid)
        ]);
        setRecommendations(rec || []);
        setPending(pend || []);
        setFriends(fr || []);
      } catch (err) {
        console.error('Error loading friends data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSendRequest = async (friendId) => {
    if (!userId || actionLoading[friendId]) return;

    setActionLoading((prev) => ({ ...prev, [friendId]: true }));
    try {
      await userService.sendFriendRequest(userId, friendId);
      const [rec, pend] = await Promise.all([
        userService.getRecommendations(userId),
        userService.getPendingFriendRequests(userId)
      ]);
      setRecommendations(rec || []);
      setPending(pend || []);
    } catch (err) {
      console.error('Error sending friend request:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  const handleAccept = async (friendId) => {
    if (!userId || actionLoading[friendId]) return;

    setActionLoading(prev => ({ ...prev, [friendId]: true }));
    try {
      await userService.acceptFriendRequest(userId, friendId);
      setPending((prev) => prev.filter((u) => u.id !== friendId));
    } catch (err) {
      console.error('Error accepting friend request:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [friendId]: false }));
    }
  };

  const handleReject = async (friendId) => {
    if (!userId || actionLoading[friendId]) return;

    setActionLoading(prev => ({ ...prev, [friendId]: true }));
    try {
      await userService.rejectFriendRequest(userId, friendId);
      setPending((prev) => prev.filter((u) => u.id !== friendId));
    } catch (err) {
      console.error('Error rejecting friend request:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [friendId]: false }));
    }
  };

  const handleDeleteFriend = async (friendId) => {
    if (!userId || actionLoading[friendId]) return;

    setActionLoading(prev => ({ ...prev, [friendId]: true }));
    try {
      await userService.deleteFriendship(userId, friendId);
      setFriends((prev) => prev.filter((u) => u.id !== friendId));
    } catch (err) {
      console.error('Error deleting friendship:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [friendId]: false }));
    }
  };

  const filteredRecommendations = useMemo(
      () =>
          recommendations.filter(
              (u) =>
                  `${u.nombres || u.name || ''} ${u.apellidos || ''}`
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                  (u.username || '').toLowerCase().includes(search.toLowerCase())
          ),
      [recommendations, search]
  );

  const UserCard = ({ user, type, onSendRequest, onAccept, onReject, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const name = user.nombres ? `${user.nombres} ${user.apellidos}` : user.name;
    const isLoading = actionLoading[user.id];

    return (
        <div
            style={{
              ...styles.userCard,
              ...(isHovered ? styles.userCardHover : {}),
              position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
          {type === 'pending' && (
              <div style={styles.pendingBadge}>
                Solicitud pendiente
              </div>
          )}

          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {(name || '').charAt(0).toUpperCase()}
            </div>

            <div style={styles.userDetails}>
              <h3 style={styles.userName}>{name || 'Usuario'}</h3>
              <p style={styles.userUsername}>@{user.username}</p>

              <div style={styles.userMeta}>
                <div style={styles.metaItem}>
                  <Mail size={12} />
                  <span>{user.correoUbb || 'Email no disponible'}</span>
                </div>
                {user.campus && (
                    <div style={styles.metaItem}>
                      <User size={12} />
                      <span>Campus {user.campus.nombre || user.campus}</span>
                    </div>
                )}
              </div>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            {type === 'recommendation' && (
                <button
                    onClick={() => onSendRequest(user.id)}
                    disabled={isLoading}
                    style={{
                      ...styles.primaryButton,
                      ...(isLoading ? styles.disabledButton : {})
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.backgroundColor = UBB_COLORS.primaryDark;
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.target.style.backgroundColor = UBB_COLORS.primary;
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                >
                  <UserPlus size={14} />
                  {isLoading ? 'Enviando...' : 'Agregar amigo'}
                </button>
            )}

            {type === 'pending' && (
                <>
                  <button
                      onClick={() => onAccept(user.id)}
                      disabled={isLoading}
                      style={{
                        ...styles.successButton,
                        ...(isLoading ? styles.disabledButton : {})
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) e.target.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) e.target.style.opacity = '1';
                      }}
                  >
                    <UserCheck size={14} />
                    {isLoading ? 'Aceptando...' : 'Aceptar'}
                  </button>

                  <button
                      onClick={() => onReject(user.id)}
                      disabled={isLoading}
                      style={{
                        ...styles.dangerButton,
                        ...(isLoading ? styles.disabledButton : {})
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) e.target.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) e.target.style.opacity = '1';
                      }}
                  >
                    <UserX size={14} />
                    {isLoading ? 'Rechazando...' : 'Rechazar'}
                  </button>
                </>
            )}
            {type === 'friend' && (
                <button
                    onClick={() => onDelete(user.id)}
                    disabled={isLoading}
                    style={{
                      ...styles.dangerButton,
                      ...(isLoading ? styles.disabledButton : {})
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) e.target.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) e.target.style.opacity = '1';
                    }}
                >
                  <UserX size={14} />
                  {isLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
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
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando comunidad...</p>
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
              <h1 style={styles.title}>Comunidad</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Tabs */}
          <div style={styles.tabContainer}>
            <button
                onClick={() => setTab(0)}
                style={{
                  ...styles.tab,
                  ...(tab === 0 ? styles.activeTab : styles.inactiveTab)
                }}
            >
              <Users size={16} />
              Podrías conocer
            </button>
            <button
                onClick={() => setTab(1)}
                style={{
                  ...styles.tab,
                  ...(tab === 1 ? styles.activeTab : styles.inactiveTab)
                }}
            >
              <Heart size={16} />
              Solicitudes pendientes ({pending.length})
            </button>
            <button
                onClick={() => setTab(2)}
                style={{
                  ...styles.tab,
                  ...(tab === 2 ? styles.activeTab : styles.inactiveTab)
                }}
            >
              <User size={16} />
              Amigos ({friends.length})
            </button>
          </div>

          {/* Search Bar (solo en tab de recomendaciones) */}
          {tab === 0 && (
              <div style={styles.searchContainer}>
                <Search style={styles.searchIcon} size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o usuario..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
          )}

          {/* Content */}
          {tab === 0 && (
              <>
                {filteredRecommendations.length > 0 ? (
                    <div>
                      {filteredRecommendations.map((user) => (
                          <UserCard
                              key={user.id}
                              user={user}
                              type="recommendation"
                              onSendRequest={handleSendRequest}
                          />
                      ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                      <Users style={styles.emptyIcon} size={64} />
                      <h3 style={styles.emptyTitle}>
                        {search ? 'No se encontraron usuarios' : 'No hay recomendaciones disponibles'}
                      </h3>
                      <p style={styles.emptyText}>
                        {search
                            ? 'Intenta con otros términos de búsqueda para encontrar más estudiantes de la comunidad UBB.'
                            : 'Por el momento no tenemos nuevas recomendaciones de amistad para ti. ¡Vuelve pronto para ver más sugerencias!'}
                      </p>
                    </div>
                )}
              </>
          )}

          {tab === 1 && (
              <>
                {pending.length > 0 ? (
                    <div>
                      {pending.map((user) => (
                          <UserCard
                              key={user.id}
                              user={user}
                              type="pending"
                              onAccept={handleAccept}
                              onReject={handleReject}
                          />
                      ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                      <MessageCircle style={styles.emptyIcon} size={64} />
                      <h3 style={styles.emptyTitle}>No hay solicitudes pendientes</h3>
                      <p style={styles.emptyText}>
                        Cuando otros estudiantes te envíen solicitudes de amistad, aparecerán aquí para que puedas aceptarlas o rechazarlas.
                      </p>
                    </div>
                )}
              </>
          )}

          {tab === 2 && (
              <>
                {friends.length > 0 ? (
                    <div>
                      {friends.map((user) => (
                          <UserCard
                              key={user.id}
                              user={user}
                              type="friend"
                              onDelete={handleDeleteFriend}
                          />
                      ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                      <Users style={styles.emptyIcon} size={64} />
                      <h3 style={styles.emptyTitle}>Aún no tienes amigos</h3>
                      <p style={styles.emptyText}>
                        Cuando agregues amigos a tu comunidad aparecerán en esta sección.
                      </p>
                    </div>
                )}
              </>
          )}
        </main>
      </div>
  );
};

export default FriendsPage;