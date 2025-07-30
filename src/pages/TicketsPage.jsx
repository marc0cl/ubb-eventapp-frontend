import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { UBB_COLORS } from '../styles/colors';
import ticketService from '../services/ticketService';

const TicketsPage = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await ticketService.getOpenTickets();
                setTickets(data || []);
            } catch (err) {
                console.error('Error fetching tickets', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleClose = async (id) => {
        try {
            setClosing(true);
            await ticketService.closeTicket(id);
            setTickets(tickets.filter(t => t.id !== id));
            setSelected(null);
        } catch (err) {
            console.error('Error closing ticket', err);
        } finally {
            setClosing(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border:`2px solid ${UBB_COLORS.primary}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto' }} />
                    <p style={{ marginTop:'16px', color:'#6b7280' }}>Cargando tickets...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const styles = {
        container: { minHeight: '100vh', backgroundColor: '#f9fafb' },
        header: { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' },
        headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 16px', height:'64px', display:'flex', alignItems:'center' },
        backButton: { display:'flex', alignItems:'center', gap:'4px', padding:'8px 12px', background:'transparent', border:'none', cursor:'pointer', color:'#6b7280', fontSize:'14px', borderRadius:'8px', transition:'all 0.2s' },
        title: { fontSize:'20px', fontWeight:'bold', color:'#1f2937', marginLeft:'16px' },
        main: { maxWidth:'1200px', margin:'0 auto', padding:'32px 16px' },
        listItem: { background:'white', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'16px', marginBottom:'12px', cursor:'pointer', transition:'all 0.2s' },
        modal: { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
        modalContent: { background:'white', borderRadius:'8px', padding:'24px', width:'90%', maxWidth:'500px' },
        button: { padding:'8px 16px', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'14px', fontWeight:'500' }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={styles.backButton}
                        onMouseEnter={e => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                    >
                        <ChevronLeft size={20} /> Volver
                    </button>
                    <h1 style={styles.title}>Tickets</h1>
                </div>
            </header>
            <main style={styles.main}>
                {tickets.length === 0 ? (
                    <p style={{ color:'#6b7280' }}>No hay tickets abiertos</p>
                ) : (
                    tickets.map(t => (
                        <div key={t.id} style={styles.listItem} onClick={() => setSelected(t)}
                            onMouseEnter={e => {e.currentTarget.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor='#d1d5db';}}
                            onMouseLeave={e => {e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#e5e7eb';}}
                        >
                            <strong>Ticket #{t.id}</strong>
                            <p style={{ color:'#6b7280', marginTop:'4px' }}>{t.descripcion}</p>
                        </div>
                    ))
                )}
            </main>
            {selected && (
                <div style={styles.modal} onClick={e => {if(e.target===e.currentTarget) setSelected(null);}}>
                    <div style={styles.modalContent}>
                        <h2 style={{ fontWeight:'600', marginBottom:'8px' }}>Ticket #{selected.id}</h2>
                        <p style={{ marginBottom:'16px' }}>{selected.descripcion}</p>
                        <div style={{ display:'flex', justifyContent:'flex-end', gap:'8px' }}>
                            <button
                                style={{ ...styles.button, backgroundColor:'#e5e7eb', color:'#374151' }}
                                onClick={() => setSelected(null)}
                            >Cerrar</button>
                            <button
                                style={{ ...styles.button, backgroundColor:UBB_COLORS.primary, color:'white' }}
                                onClick={() => handleClose(selected.id)}
                                disabled={closing}
                            >{closing ? 'Cerrando...' : 'Marcar como resuelto'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketsPage;
