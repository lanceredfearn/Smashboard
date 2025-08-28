import {
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';
import { useTournament } from '../state/useTournament';
import type { ResultMark } from '../types';

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
                                <RadioGroup
                                    row
                                    value={court.result ?? ''}
                                    onChange={(_, v) => markResult(court.court, v as ResultMark)}
                                >
                                    <FormControlLabel value="A" control={<Radio />} label="A won" />
                                    <FormControlLabel value="B" control={<Radio />} label="B won" />
                                </RadioGroup>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
