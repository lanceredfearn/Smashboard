import { Card, CardContent, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTournament } from '../state/useTournament';
import type { ResultMark } from '../types';

const teamLabel = (ids: string[], getName: (id: string) => string) =>
    ids.map(getName).join(' & ');

export default function CourtsGrid() {
    const courts = useTournament(s => s.courts);
    const players = useTournament(s => s.players);
    const mark = useTournament(s => s.markCourtResult);

    const getName = (id: string) => players.find(p => p.id === id)?.name ?? 'Unknown';

    if (!courts.length) return null;

    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {courts.map(c => (
                <Grid key={c.court} xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Court {c.court}
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    <strong>A:</strong> {teamLabel(c.teamA, getName)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>B:</strong> {teamLabel(c.teamB, getName)}
                                </Typography>
                                <RadioGroup
                                    row
                                    value={c.result ?? ''}
                                    onChange={(_, v) => mark(c.court, (v as ResultMark) || 'T')}
                                >
                                    <FormControlLabel value="A" control={<Radio />} label="A won" />
                                    <FormControlLabel value="B" control={<Radio />} label="B won" />
                                    <FormControlLabel value="T" control={<Radio />} label="Tie" />
                                </RadioGroup>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
