import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  TextField,
  Typography
} from '@mui/material';
import userService from '../services/userService';
import { getUserIdFromToken } from '../utils/auth';

const FriendsPage = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [pending, setPending] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const uid = getUserIdFromToken(token);
      if (!uid) return;
      setUserId(uid);
      try {
        const [rec, pend] = await Promise.all([
          userService.getRecommendations(uid),
          userService.getPendingFriendRequests(uid)
        ]);
        setRecommendations(rec || []);
        setPending(pend || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleAccept = async (friendId) => {
    if (!userId) return;
    try {
      await userService.acceptFriendRequest(userId, friendId);
      setPending((prev) => prev.filter((u) => u.id !== friendId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (friendId) => {
    if (!userId) return;
    try {
      await userService.rejectFriendRequest(userId, friendId);
      setPending((prev) => prev.filter((u) => u.id !== friendId));
    } catch (err) {
      console.error(err);
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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Comunidad
      </Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 3 }}>
        <Tab label="Podr\u00edas conocer" />
        <Tab label="Solicitudes pendientes" />
      </Tabs>
      {tab === 0 && (
        <Box>
          <TextField
            fullWidth
            label="Buscar usuario"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
          />
          <List>
            {filteredRecommendations.map((user) => {
              const name = user.nombres ? `${user.nombres} ${user.apellidos}` : user.name;
              return (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      onClick={() => userService.sendFriendRequest(userId, user.id)}
                    >
                      Agregar
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{(name || '').charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={name} secondary={`@${user.username}`} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <List>
            {pending.map((user) => {
              const name = user.nombres ? `${user.nombres} ${user.apellidos}` : user.name;
              return (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleAccept(user.id)}
                      >
                        Aceptar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(user.id)}
                      >
                        Rechazar
                      </Button>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{(name || '').charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={name} secondary={`@${user.username}`} />
                </ListItem>
              );
            })}
            {pending.length === 0 && <Typography>No hay solicitudes pendientes.</Typography>}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default FriendsPage;
