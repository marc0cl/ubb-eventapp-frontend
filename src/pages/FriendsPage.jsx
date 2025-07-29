import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';

function generateUsers(count = 20) {
  const firstNames = [
    'Ana','Pedro','Luis','Maria','Juan','Carmen','Jose','Lucia','Carlos','Sofia'
  ];
  const lastNames = [
    'Gonzalez','Rodriguez','Perez','Sanchez','Martinez','Lopez','Diaz','Vargas','Rojas','Silva'
  ];
  const users = [];
  for (let i = 0; i < count; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${first} ${last}`;
    const username = `${first.toLowerCase()}.${last.toLowerCase()}${i}`;
    users.push({ id: i + 1, name, username });
  }
  return users;
}

const FriendsPage = () => {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const users = useMemo(() => generateUsers(30), []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const addFriend = (id) => {
    if (!friends.includes(id)) {
      setFriends([...friends, id]);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Encuentra nuevos amigos
      </Typography>
      <TextField
        fullWidth
        label="Buscar usuario"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />
      <List>
        {filtered.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <Button
                variant="contained"
                onClick={() => addFriend(user.id)}
                disabled={friends.includes(user.id)}
              >
                {friends.includes(user.id) ? 'Agregado' : 'Agregar'}
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar>{user.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={`@${user.username}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FriendsPage;
