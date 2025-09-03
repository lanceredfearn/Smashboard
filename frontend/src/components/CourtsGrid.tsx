import {
    Card,
    CardContent,
    Stack,
    Typography,
    TextField,
    Button,
    IconButton,
    Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';
import { useTournament } from '../state/useTournament';

export default function CourtsGrid() {
    const courts = useTournament(s => s.courts);
    const players = useTournament(s => s.players);
    const markResult = useTournament(s => s.markCourtResult);
    const editGame = useTournament(s => s.editGameScore);
    const submitCourt = useTournament(s => s.submitCourt);
    const submitRound = useTournament(s => s.submitRound);

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

    const roundComplete = courts.every(c => c.submitted && c.game === 3);
    const scoreInputSx = { width: 60 } as const;

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
                                {!court.submitted && (
                                    <>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="body2" sx={{ flexBasis: 0, flexGrow: 1, minWidth: 0 }}>
                                                <strong>A:</strong> {formatTeam(court.teamA)}
                                            </Typography>
                                            <TextField
                                                size="small"
                                                value={court.scoreA ?? ''}
                                                onChange={e => markResult(court.court, { scoreA: e.target.value === '' ? undefined : Number(e.target.value) })}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                                sx={scoreInputSx}
                                            />
                                            <Box sx={{ width: 40 }} />
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="body2" sx={{ flexBasis: 0, flexGrow: 1, minWidth: 0 }}>
                                                <strong>B:</strong> {formatTeam(court.teamB)}
                                            </Typography>
                                            <TextField
                                                size="small"
                                                value={court.scoreB ?? ''}
                                                onChange={e => markResult(court.court, { scoreB: e.target.value === '' ? undefined : Number(e.target.value) })}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                                sx={scoreInputSx}
                                            />
                                            <IconButton
                                                color="success"
                                                size="small"
                                                onClick={() => submitCourt(court.court)}
                                                disabled={!canSubmit(court)}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                        </Stack>
                                    </>
                                )}
                                {(court.history ?? []).map(g => (
                                    <Stack key={g.game} spacing={0.5}>
                                        <Typography variant="body2">
                                            Game {g.game}: {formatTeam(g.teamA)} {g.scoreA}–{g.scoreB} {formatTeam(g.teamB)}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <TextField
                                                label="A"
                                                size="small"
                                                value={g.scoreA}
                                                onChange={e => editGame(g.round, court.court, g.game, { scoreA: Number(e.target.value) })}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                                sx={scoreInputSx}
                                            />
                                            <TextField
                                                label="B"
                                                size="small"
                                                value={g.scoreB}
                                                onChange={e => editGame(g.round, court.court, g.game, { scoreB: Number(e.target.value) })}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                                sx={scoreInputSx}
                                            />
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            {roundComplete && (
                <Grid xs={12} textAlign="center" sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={submitRound}>
                        Submit Round
                    </Button>
                </Grid>
            )}
        </Grid>
    );
}
