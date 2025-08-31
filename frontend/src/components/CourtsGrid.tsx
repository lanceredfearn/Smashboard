import {
    Card,
    CardContent,
    Stack,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';
import { useTournament } from '../state/useTournament';

export default function CourtsGrid() {
    const courts = useTournament(s => s.courts);
    const players = useTournament(s => s.players);
    const markResult = useTournament(s => s.markCourtResult);
    const submitCourt = useTournament(s => s.submitCourt);

    const nameMap = useMemo(() => {
        const map: Record<string, string> = {};
        players.forEach(p => { map[p.id] = p.name; });
        return map;
    }, [players]);

    const formatTeam = (ids: string[]) =>
        ids.map(id => nameMap[id] ?? 'Unknown').join(' & ');

    if (!courts.length) return null;

    const canSubmit = (court: typeof courts[number]) =>
        court.scoreA !== undefined &&
        court.scoreB !== undefined &&
        ((court.scoreA >= 11 || court.scoreB >= 11) && Math.abs(court.scoreA - court.scoreB) >= 2);

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
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField
                                        label="A"
                                        size="small"
                                        value={court.scoreA ?? ''}
                                        onChange={e => markResult(court.court, { scoreA: e.target.value === '' ? undefined : Number(e.target.value) })}
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        sx={{ width: 60 }}
                                        disabled={court.submitted}
                                    />
                                    <TextField
                                        label="B"
                                        size="small"
                                        value={court.scoreB ?? ''}
                                        onChange={e => markResult(court.court, { scoreB: e.target.value === '' ? undefined : Number(e.target.value) })}
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        sx={{ width: 60 }}
                                        disabled={court.submitted}
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => submitCourt(court.court)}
                                        disabled={court.submitted || !canSubmit(court)}
                                    >
                                        {court.submitted ? 'Submitted' : 'Submit'}
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
