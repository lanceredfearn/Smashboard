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
    const editGame = useTournament(s => s.editGameScore);
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
                                Court {court.court} – Game {court.game}
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    <strong>A:</strong> {formatTeam(court.teamA)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>B:</strong> {formatTeam(court.teamB)}
                                </Typography>
                                {court.history.map(g => (
                                    <Stack key={g.game} direction="row" spacing={1} alignItems="center">
                                        <Typography variant="body2">Game {g.game}</Typography>
                                        <TextField
                                            label="A"
                                            size="small"
                                            value={g.scoreA}
                                            onChange={e => editGame(court.court, g.game, { scoreA: Number(e.target.value) })}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                            sx={{ width: 60 }}
                                        />
                                        <TextField
                                            label="B"
                                            size="small"
                                            value={g.scoreB}
                                            onChange={e => editGame(court.court, g.game, { scoreB: Number(e.target.value) })}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                            sx={{ width: 60 }}
                                        />
                                    </Stack>
                                ))}
                                {!court.submitted && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <TextField
                                            label="A"
                                            size="small"
                                            value={court.scoreA ?? ''}
                                            onChange={e => markResult(court.court, { scoreA: e.target.value === '' ? undefined : Number(e.target.value) })}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                            sx={{ width: 60 }}
                                        />
                                        <TextField
                                            label="B"
                                            size="small"
                                            value={court.scoreB ?? ''}
                                            onChange={e => markResult(court.court, { scoreB: e.target.value === '' ? undefined : Number(e.target.value) })}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                            sx={{ width: 60 }}
                                        />
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => submitCourt(court.court)}
                                            disabled={!canSubmit(court)}
                                        >
                                            Submit
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
