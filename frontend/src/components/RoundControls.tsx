import { Chip, Stack, Typography } from '@mui/material';
import { useTournament } from '../state/useTournament';

export default function RoundControls() {
    const started = useTournament(s => s.started);
    const round = useTournament(s => s.round);
    const totalRounds = useTournament(s => s.totalRounds);

    const statusLabel = started
        ? `Round ${round}`
        : round >= totalRounds && round > 0
            ? 'Finished'
            : 'Not started';

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={statusLabel} color={started ? 'primary' : 'default'} />
                <Typography variant="body2" color="text.secondary">of {totalRounds} rounds</Typography>
            </Stack>
        </Stack>
    );
}
