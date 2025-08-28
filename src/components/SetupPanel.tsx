import { Button, Stack, TextField, Typography } from '@mui/material';
import { useTournament } from '../state/useTournament';
import { useState } from 'react';

export default function SetupPanel() {
    const { maxCourts, totalRounds, entryFee, payoutPercents, started } = useTournament();
    const setConfig = useTournament(s => s.setConfig);
    const start = useTournament(s => s.startTournament);
    const reset = useTournament(s => s.reset);
    const canStart = useTournament(s => s.canStart);

    const [splitText, setSplitText] = useState(payoutPercents.map(p => Math.round(p)).join(','));

    return (
        <Stack spacing={1.5}>
            <Typography variant="h6">Setup</Typography>
            <TextField
                label="Number of Courts (max 10)"
                type="number"
                value={maxCourts}
                onChange={e => setConfig({ maxCourts: Math.max(1, Math.min(10, Number(e.target.value || 10))) })}
                disabled={started}
                size="small"
            />
            <TextField
                label="Total Rounds"
                type="number"
                value={totalRounds}
                onChange={e => setConfig({ totalRounds: Math.max(1, Math.min(50, Number(e.target.value || 8))) })}
                size="small"
            />
            <TextField
                label="Entry Fee ($)"
                type="number"
                value={entryFee}
                onChange={e => setConfig({ entryFee: Math.max(0, Number(e.target.value || 30)) })}
                size="small"
            />
            <TextField
                label="Payout Split (%) e.g. 50,30,20"
                value={splitText}
                onChange={e => setSplitText(e.target.value)}
                onBlur={() => {
                    const arr = splitText.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0);
                    setConfig({ payoutPercents: arr.length ? arr : [50, 30, 20] });
                }}
                size="small"
            />
            <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={start} disabled={!canStart()}>
                    Start Tournament
                </Button>
                <Button variant="outlined" color="error" onClick={reset}>
                    Reset
                </Button>
            </Stack>
        </Stack>
    );
}
