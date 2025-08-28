import { Button, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTournament } from '../state/useTournament';

export default function TimerControls() {
    const started = useTournament(s => s.started);
    const round = useTournament(s => s.round);
    const totalRounds = useTournament(s => s.totalRounds);
    const roundSeconds = useTournament(s => s.roundSeconds);
    const endsAt = useTournament(s => s.timerEndsAt);
    const startTimer = useTournament(s => s.startRoundTimer);
    const endTimer = useTournament(s => s.endRoundTimer);
    const nextRound = useTournament(s => s.nextRound);

    const [remaining, setRemaining] = useState<number>(roundSeconds);

    useEffect(() => {
        let t: number | undefined;
        const tick = () => {
            if (!endsAt) { setRemaining(roundSeconds); return; }
            const now = Math.floor(Date.now() / 1000);
            const left = Math.max(0, endsAt - now);
            setRemaining(left);
        };
        tick();
        t = window.setInterval(tick, 300);
        return () => clearInterval(t);
    }, [endsAt, roundSeconds]);

    const fmt = (s: number) => {
        const m = Math.floor(s / 60), r = s % 60;
        return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
    };

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={started ? `Round ${round}` : 'Not started'} color={started ? 'primary' : 'default'} />
                <Typography variant="body2" color="text.secondary">of {totalRounds}</Typography>
            </Stack>
            <Typography variant="h5" fontWeight={700}>{fmt(remaining)}</Typography>
            <Stack direction="row" spacing={1}>
                <Button onClick={startTimer} disabled={!started}>Start Round</Button>
                <Button onClick={endTimer} color="warning" disabled={!started}>End Round</Button>
                <Button onClick={nextRound} variant="contained" disabled={!started}>Next Round</Button>
            </Stack>
        </Stack>
    );
}
