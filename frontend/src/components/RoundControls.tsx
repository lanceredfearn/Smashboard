import { Button, Chip, Stack, Typography } from '@mui/material';
import { useTournament } from '../state/useTournament';

export default function RoundControls() {
    const started = useTournament(s => s.started);
    const round = useTournament(s => s.round);
    const game = useTournament(s => s.game);
    const totalRounds = useTournament(s => s.totalRounds);
    const courts = useTournament(s => s.courts);
    const nextGame = useTournament(s => s.nextGame);

    const allResultsSubmitted = courts.length > 0 && courts.every(c =>
        c.scoreA !== undefined &&
        c.scoreB !== undefined &&
        ((c.scoreA >= 11 || c.scoreB >= 11) && Math.abs(c.scoreA - c.scoreB) >= 2)
    );
    const statusLabel = started
        ? `Round ${round} – Game ${game}`
        : round >= totalRounds && round > 0
            ? 'Finished'
            : 'Not started';

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={statusLabel} color={started ? 'primary' : 'default'} />
                <Typography variant="body2" color="text.secondary">of {totalRounds} rounds</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
                <Button onClick={nextGame} variant="contained" disabled={!started || !allResultsSubmitted}>
                    Next Game
                </Button>
            </Stack>
        </Stack>
    );
}
