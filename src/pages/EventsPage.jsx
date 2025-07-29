import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
    Pagination
} from '@mui/material';
import eventService from '../services/eventService';
import { UBB_COLORS } from '../styles/colors';
import { getUserIdFromToken, getRoleFromToken } from '../utils/auth';

const EventCard = ({
    event,
    editable,
    pending,
    registered,
    onEdit,
    onDelete,
    onApprove,
    onRegister,
    onCancel
}) => (
    <Card sx={{ mb: 2, backgroundColor: '#f7f7f7' }}>
        <CardContent>
            <Typography variant="subtitle1" sx={{ color: UBB_COLORS.primary }}>
                {event.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {new Date(event.fechaInicio).toLocaleString()} {' - '}
                {new Date(event.fechaFin).toLocaleString()}
            </Typography>
            <Typography variant="body2">{event.lugar}</Typography>
            {event.estadoValidacion === 'PENDIENTE' && (
                <Typography variant="caption" color="orange">
                    Pendiente de aprobación
                </Typography>
            )}
            <Box sx={{ mt: 1 }}>
                {pending && (
                    <Button size="small" onClick={() => onApprove(event.id)} sx={{ mr: 1 }}>
                        Aprobar
                    </Button>
                )}
                {editable && (
                    <>
                        <Button size="small" onClick={() => onEdit(event)} sx={{ mr: 1 }}>
                            Editar
                        </Button>
                        <Button size="small" color="error" onClick={() => onDelete(event.id)}>
                            Eliminar
                        </Button>
                    </>
                )}
                {!editable && !pending && (
                    registered ? (
                        <Button size="small" onClick={() => onCancel(event.id)}>
                            Cancelar Inscripción
                        </Button>
                    ) : (
                        <Button size="small" onClick={() => onRegister(event.id)}>
                            Inscribirse
                        </Button>
                    )
                )}
            </Box>
        </CardContent>
    </Card>
);

const EventsPage = () => {
    const [tab, setTab] = useState(0);
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [registeredIds, setRegisteredIds] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        lugar: '',
        aforoMax: '',
        visibilidad: true
    });
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const EVENTS_PER_PAGE = 20;

    useEffect(() => {
        const load = async () => {
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

    const handleCreateOrUpdate = async () => {
        try {
            const data = { ...formData, aforoMax: Number(formData.aforoMax), visibilidad: formData.visibilidad };
            if (editingId) {
                await eventService.updateEvent({ ...data, id: editingId });
            } else {
                await eventService.createEvent(data);
            }
            setFormOpen(false);
            setFormData({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', lugar: '', aforoMax: '', visibilidad: true });
            setEditingId(null);
            await refreshAll();
        } catch (err) {
            console.error('Error saving event', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await eventService.deleteEvent(id);
            await refreshAll();
        } catch (err) {
            console.error('Error deleting event', err);
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
            visibilidad: ev.visibilidad !== false
        });
        setFormOpen(true);
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1" sx={{ color: UBB_COLORS.primary }}>
                    Eventos
                </Typography>
                <Button variant="contained" onClick={() => setFormOpen(true)} style={{ backgroundColor: UBB_COLORS.primary }}>
                    Crear Evento
                </Button>
            </Box>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
                <Tab label="Todos" />
                <Tab label="Por mí" />
                {(role === 'MODERADOR' || role === 'ADMINISTRADOR') && <Tab label="Por validar" />}
            </Tabs>
            <Box>
                {tab === 0 &&
                    events
                        .slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE)
                        .map((ev) => (
                        <EventCard
                            key={ev.id}
                            event={ev}
                            registered={registeredIds.includes(ev.id)}
                            onRegister={handleRegister}
                            onCancel={handleCancel}
                        />
                    ))}
                {tab === 1 && myEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} editable onEdit={openForEdit} onDelete={handleDelete} />
                ))}
                {tab === 2 && (role === 'MODERADOR' || role === 'ADMINISTRADOR') &&
                    pendingEvents.map((ev) => (
                        <EventCard key={ev.id} event={ev} pending onApprove={handleApprove} onDelete={handleDelete} />
                    ))}
            </Box>
            {tab === 0 && events.length > EVENTS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={Math.ceil(events.length / EVENTS_PER_PAGE)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            )}
            <Dialog open={formOpen} onClose={() => { setFormOpen(false); setEditingId(null); }} fullWidth maxWidth="sm">
                <DialogTitle>{editingId ? 'Editar Evento' : 'Crear Evento'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Título"
                        fullWidth
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha Inicio"
                        type="datetime-local"
                        fullWidth
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha Fin"
                        type="datetime-local"
                        fullWidth
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Lugar"
                        fullWidth
                        value={formData.lugar}
                        onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Aforo Máximo"
                        type="number"
                        fullWidth
                        value={formData.aforoMax}
                        onChange={(e) => setFormData({ ...formData, aforoMax: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.visibilidad}
                                onChange={(e) => setFormData({ ...formData, visibilidad: e.target.checked })}
                                color="primary"
                            />
                        }
                        label="Evento Público"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setFormOpen(false); setEditingId(null); }}>Cancelar</Button>
                    <Button onClick={handleCreateOrUpdate} variant="contained" style={{ backgroundColor: UBB_COLORS.primary }}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EventsPage;
