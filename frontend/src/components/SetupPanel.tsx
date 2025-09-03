import { Button, Stack, TextField, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTournament } from '../state/useTournament';
import { useAnnouncements } from '../state/useAnnouncements';

export default function SetupPanel() {
    const location = useLocation();
    const isSmb = location.pathname.startsWith('/smb');
    const {
        entryFee,
        buyInFee,
        setConfig,
        startTournament,
        reset,
        canStart,
        started,
        round,
        totalRounds,
        players,
        standings,
    } = useTournament();
    const addAnnouncement = useAnnouncements(s => s.addAnnouncement);

    const handleReset = () => {
        if (!started && round === totalRounds && players.length > 0) {
            const winners = standings().slice(0, 3).map(p => ({ name: p.name, score: p.pointsWon }));
            addAnnouncement({ tournament: isSmb ? 'SMB' : 'SNL', winners });
        }
        reset();
    };

    return (
        <Stack spacing={1.5}>
            <Typography variant="h6">Tournament</Typography>
            <TextField
                label={isSmb ? "Buy-In Fee ($)" : "Entry Fee ($)"}
                type="number"
                value={isSmb ? buyInFee : entryFee}
                onChange={e =>
                    setConfig(
                        isSmb
                            ? { buyInFee: Math.max(0, Number(e.target.value || 20)) }
                            : { entryFee: Math.max(0, Number(e.target.value || 30)) }
                    )
                }
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
                <Button variant="outlined" color="error" onClick={handleReset}>
                    Reset
                </Button>
            </Stack>
        </Stack>
    );
}
