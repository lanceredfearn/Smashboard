import {
    Card,
    CardContent,
    Stack,
    Typography,
    TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';
import { useTournament } from '../state/useTournament';

export default function CourtsGrid() {
    const courts = useTournament(s => s.courts);
    const players = useTournament(s => s.players);
    const markResult = useTournament(s => s.markCourtResult);

    const nameMap = useMemo(() => {
        const map: Record<string, string> = {};
        players.forEach(p => { map[p.id] = p.name; });
        return map;
    }, [players]);

    const formatTeam = (ids: string[]) =>
        ids.map(id => nameMap[id] ?? 'Unknown').join(' & ');

    if (!courts.length) return null;

    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {courts.map(court => (
                <Grid key={court.court} xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Court {court.court}
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    <strong>A:</strong> {formatTeam(court.teamA)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>B:</strong> {formatTeam(court.teamB)}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        label="A"
                                        type="number"
                                        size="small"
                                        value={court.scoreA ?? ''}
                                        onChange={e => markResult(court.court, { scoreA: e.target.value === '' ? undefined : Number(e.target.value) })}
                                        inputProps={{ min: 0 }}
                                        sx={{ width: 60 }}
                                    />
                                    <TextField
                                        label="B"
                                        type="number"
                                        size="small"
                                        value={court.scoreB ?? ''}
                                        onChange={e => markResult(court.court, { scoreB: e.target.value === '' ? undefined : Number(e.target.value) })}
                                        inputProps={{ min: 0 }}
                                        sx={{ width: 60 }}
                                    />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
