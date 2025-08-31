import {
    Autocomplete,
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

    type DbPlayer = { name: string; rating: number };
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<DbPlayer[]>([]);
    const [selected, setSelected] = useState<DbPlayer | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setOptions([]);
            return;
        }
        const controller = new AbortController();
        fetch(`/api/players/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
            .then(res => res.json())
            .then((data: DbPlayer[]) => setOptions(data))
            .catch(() => {});
        return () => controller.abort();
    }, [query]);

    const handleAdd = () => {
        if (!selected) return;
        const trimmedName = selected.name.trim();
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
        add(trimmedName, selected.rating);
        setSelected(null);
        setQuery('');
    };

    return (
        <Stack spacing={3.0}>
            <Typography variant="h6">Players ({players.length})</Typography>
            <Stack direction="row" spacing={1}>
                <Autocomplete<DbPlayer>
                    options={options}
                    getOptionLabel={o => o.name}
                    value={selected}
                    onChange={(_, v) => setSelected(v)}
                    inputValue={query}
                    onInputChange={(_, v) => setQuery(v)}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Player name"
                            size="small"
                            fullWidth
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleAdd();
                            }}
                        />
                    )}
                    disabled={started}
                />
                <TextField
                    label="DUPR"
                    value={selected?.rating ?? ''}
                    size="small"
                    sx={{ width: 100 }}
                    disabled
                />
                <Button onClick={handleAdd} variant="contained" disabled={started || !selected}>
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
