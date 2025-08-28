import { Button, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTournament } from '../state/useTournament';
import { useState } from 'react';

export default function PlayerList() {
    const players = useTournament(s => s.players);
    const add = useTournament(s => s.addPlayer);
    const remove = useTournament(s => s.removePlayer);
    const started = useTournament(s => s.started);

    const [name, setName] = useState('');

    const onAdd = () => {
        const n = name.trim();
        if (!n) return;
        if (players.length >= 40) { alert('Max 40 players (10 courts × 4).'); return; }
        if (players.some(p => p.name.toLowerCase() === n.toLowerCase())) { alert('Name already added.'); return; }
        add(n);
        setName('');
    };

    return (
        <Stack spacing={1.5}>
            <Typography variant="h6">Players ({players.length})</Typography>
            <Stack direction="row" spacing={1}>
                <TextField
                    label="Add player name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    size="small"
                    fullWidth
                    onKeyDown={e => { if (e.key === 'Enter') onAdd(); }}
                />
                <Button onClick={onAdd} variant="contained" disabled={started}>Add</Button>
            </Stack>
            <Typography variant="body2" color="text.secondary">Count must be a multiple of 4 to start.</Typography>
            <Divider />
            <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
                {players.map(p => (
                    <ListItem key={p.id} secondaryAction={
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => remove(p.id)} disabled={started}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    }>
                        <ListItemText primary={p.name} />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
