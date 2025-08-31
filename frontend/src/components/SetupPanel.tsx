import { Button, Stack, TextField, Typography } from '@mui/material';
import { useTournament } from '../state/useTournament';

export default function SetupPanel() {
    const {
        maxCourts,
        totalRounds,
        entryFee,
        started,
        setConfig,
        startTournament,
        reset,
        canStart,
    } = useTournament();

    return (
        <Stack spacing={1.5}>
            <Typography variant="h6">Setup</Typography>
            <TextField
                label="Number of Courts"
                type="number"
                value={maxCourts}
                disabled
                size="small"
            />
            <TextField
                label="Total Rounds"
                type="number"
                value={totalRounds}
                disabled
                size="small"
            />
            <TextField
                label="Entry Fee ($)"
                type="number"
                value={entryFee}
                onChange={e => setConfig({ entryFee: Math.max(0, Number(e.target.value || 30)) })}
                size="small"
            />
            <Stack direction="row" spacing={1}>
                <Button
                    variant="contained"
                    onClick={startTournament}
                    disabled={!canStart()}
                >
                    Start Tournament
                </Button>
                <Button variant="outlined" color="error" onClick={reset}>
                    Reset
                </Button>
            </Stack>
        </Stack>
    );
}
