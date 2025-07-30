import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    AlertCircle,
    CheckCircle,
    Clock,
    User,
    Calendar,
    X,
    Archive
} from 'lucide-react';
import { UBB_COLORS } from '../styles/colors';
import ticketService from '../services/ticketService';

const TicketsPage = () => {
    const navigate = useNavigate();
    const [openTickets, setOpenTickets] = useState([]);
    const [closedTickets, setClosedTickets] = useState([]);
    const [tab, setTab] = useState(0); // 0 = abiertos, 1 = cerrados
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [closing, setClosing] = useState(false);

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
        ticketCard: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.2s',
            marginBottom: '16px',
            cursor: 'pointer'
        },
        ticketCardHover: {
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            borderColor: '#d1d5db'
        },
        closedTicketCard: {
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            opacity: 0.8
        },
        ticketHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
        },
        ticketId: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937'
        },
        closedTicketId: {
            color: '#6b7280'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        openBadge: {
            backgroundColor: '#fef3c7',
            color: '#d97706',
            border: '1px solid #fcd34d'
        },
        closedBadge: {
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            border: '1px solid #d1d5db'
        },
        ticketDescription: {
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.5',
            marginBottom: '16px'
        },
        closedTicketDescription: {
            color: '#9ca3af'
        },
        ticketMeta: {
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
            transition: 'background-color 0.2s',
            color: '#6b7280'
        },
        modalDescription: {
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
        },
        modalActions: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
        },
        secondaryButton: {
            padding: '12px 24px',
            backgroundColor: 'white',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
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
        disabledButton: {
            opacity: 0.5,
            cursor: 'not-allowed'
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
        }
    };

    const load = async () => {
        setLoading(true);
        try {
            const allTickets = await ticketService.getAllTickets();
            const tickets = allTickets || [];

            // Filtrar tickets por estado
            const open = tickets.filter(ticket => ticket.estado === 'ABIERTO');
            const closed = tickets.filter(ticket => ticket.estado === 'CERRADO');

            setOpenTickets(open);
            setClosedTickets(closed);
        } catch (err) {
            console.error('Error fetching tickets', err);
            setOpenTickets([]);
            setClosedTickets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleClose = async () => {
        if (!selected) return;
        const id = selected.id;
        setClosing(true);
        setSelected(null);
        try {
            await ticketService.closeTicket(id);
            await load();
        } catch (err) {
            console.error('Error closing ticket', err);
        } finally {
            setClosing(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Fecha no disponible';
        return new Date(dateStr).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const TicketCard = ({ ticket, isClosed }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <div
                style={{
                    ...styles.ticketCard,
                    ...(isClosed ? styles.closedTicketCard : {}),
                    ...(isHovered ? styles.ticketCardHover : {})
                }}
                onClick={() => setSelected(ticket)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={styles.ticketHeader}>
                    <h3 style={{
                        ...styles.ticketId,
                        ...(isClosed ? styles.closedTicketId : {})
                    }}>
                        Ticket #{ticket.id}
                    </h3>
                    <div style={{
                        ...styles.statusBadge,
                        ...(isClosed ? styles.closedBadge : styles.openBadge)
                    }}>
                        {isClosed ? (
                            <>
                                <CheckCircle size={12} />
                                Cerrado
                            </>
                        ) : (
                            <>
                                <AlertCircle size={12} />
                                Abierto
                            </>
                        )}
                    </div>
                </div>

                <p style={{
                    ...styles.ticketDescription,
                    ...(isClosed ? styles.closedTicketDescription : {})
                }}>
                    {ticket.descripcion}
                </p>

                <div style={styles.ticketMeta}>
                    <div style={styles.metaItem}>
                        <User size={12} />
                        <span>Reportado por: Usuario #{ticket.reporter?.id || 'N/A'}</span>
                    </div>
                    <div style={styles.metaItem}>
                        <Calendar size={12} />
                        <span>{formatDate(ticket.fechaCreacion)}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{ textAlign: 'center' }}>
                    <div style={styles.spinner} />
                    <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando tickets...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    const currentTickets = tab === 0 ? openTickets : closedTickets;
    const isCurrentTicketClosed = tab === 1;

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
                        <h1 style={styles.title}>Gestión de Tickets</h1>
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
                        <AlertCircle size={16} />
                        Tickets Abiertos ({openTickets.length})
                    </button>
                    <button
                        onClick={() => setTab(1)}
                        style={{
                            ...styles.tab,
                            ...(tab === 1 ? styles.activeTab : styles.inactiveTab)
                        }}
                    >
                        <Archive size={16} />
                        Tickets Cerrados ({closedTickets.length})
                    </button>
                </div>

                {/* Tickets List */}
                {currentTickets.length > 0 ? (
                    <div>
                        {currentTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                isClosed={isCurrentTicketClosed}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        {tab === 0 ? (
                            <>
                                <CheckCircle style={styles.emptyIcon} size={64} />
                                <h3 style={styles.emptyTitle}>No hay tickets abiertos</h3>
                                <p style={styles.emptyText}>
                                    ¡Excelente! No hay reportes pendientes por resolver en este momento.
                                </p>
                            </>
                        ) : (
                            <>
                                <Archive style={styles.emptyIcon} size={64} />
                                <h3 style={styles.emptyTitle}>No hay tickets cerrados</h3>
                                <p style={styles.emptyText}>
                                    Los tickets resueltos aparecerán aquí para referencia histórica.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Modal para ver detalles del ticket */}
            {selected && (
                <div
                    style={styles.modal}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelected(null);
                        }
                    }}
                >
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                Ticket #{selected.id}
                                <span style={{
                                    ...styles.statusBadge,
                                    ...(selected.estado === 'CERRADO' ? styles.closedBadge : styles.openBadge),
                                    marginLeft: '12px'
                                }}>
                                    {selected.estado === 'CERRADO' ? (
                                        <>
                                            <CheckCircle size={12} />
                                            Cerrado
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={12} />
                                            Abierto
                                        </>
                                    )}
                                </span>
                            </h2>
                            <button
                                onClick={() => setSelected(null)}
                                style={styles.closeButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Descripción del problema:
                            </h4>
                            <div style={styles.modalDescription}>
                                {selected.descripcion}
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            marginBottom: '24px',
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    marginBottom: '4px'
                                }}>
                                    Reportado por:
                                </p>
                                <p style={{ fontSize: '14px', color: '#1f2937' }}>
                                    Usuario #{selected.reporter?.id || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    marginBottom: '4px'
                                }}>
                                    Fecha de creación:
                                </p>
                                <p style={{ fontSize: '14px', color: '#1f2937' }}>
                                    {formatDate(selected.fechaCreacion)}
                                </p>
                            </div>
                        </div>

                        <div style={styles.modalActions}>
                            <button
                                onClick={() => setSelected(null)}
                                style={styles.secondaryButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                Cerrar
                            </button>
                            {selected.estado !== 'CERRADO' && (
                                <button
                                    onClick={() => handleClose(selected.id)}
                                    disabled={closing}
                                    style={{
                                        ...styles.primaryButton,
                                        ...(closing ? styles.disabledButton : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!closing) {
                                            e.target.style.backgroundColor = UBB_COLORS.primaryDark;
                                            e.target.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!closing) {
                                            e.target.style.backgroundColor = UBB_COLORS.primary;
                                            e.target.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    <CheckCircle size={16} />
                                    {closing ? 'Cerrando...' : 'Marcar como resuelto'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketsPage;