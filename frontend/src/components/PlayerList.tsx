import {
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useTournament } from '../state/useTournament';

export default function PlayerList() {
    const players = useTournament(s => s.players);
    const add = useTournament(s => s.addPlayer);
    const remove = useTournament(s => s.removePlayer);
    const started = useTournament(s => s.started);

    const [name, setName] = useState('');
    const [rating, setRating] = useState('');

    const handleAdd = () => {
        const trimmedName = name.trim();
        const numericRating = Number(rating);
        if (!trimmedName || isNaN(numericRating)) return;
        if (players.length >= 40) {
            alert('Max 40 players (10 courts × 4).');
            return;
        }
        const exists = players.some(
            p => p.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (exists) {
            alert('Name already added.');
            return;
        }
        add(trimmedName, numericRating);
        setName('');
        setRating('');
    };

    return (
        <Stack spacing={3.0}>
            <Typography variant="h6">Players ({players.length})</Typography>
            <Stack direction="row" spacing={1}>
                <TextField
                    label="Player name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    size="small"
                    fullWidth
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleAdd();
                    }}
                />
                <TextField
                    label="DUPR"
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    size="small"
                    sx={{ width: 100 }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleAdd();
                    }}
                />
                <Button onClick={handleAdd} variant="contained" disabled={started}>
                    Add
                </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary">Count must be 12-40 and a multiple of 4 to start.</Typography>
            <Divider />
            <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
                {players.map(player => (
                    <ListItem key={player.id} secondaryAction={
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => remove(player.id)} disabled={started}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    }>
                        <ListItemText primary={`${player.name} (${player.rating})`} />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
