import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTournament } from '../state/useTournament';

const currency = (n: number) => '$' + Math.round(n).toLocaleString();

export default function PayoutsTable() {
    const entry = useTournament(s => s.entryFee);
    const count = useTournament(s => s.players.length);
    const split = useTournament(s => s.payoutPercents);
    const { totalPot, places } = useTournament(s => s.payouts());

    if (!count) return null;

    return (
        <Stack spacing={1}>
            <Typography variant="h6">Payouts</Typography>
            <Typography variant="body2" color="text.secondary">
                {count} players × ${entry} entry = <strong>{currency(totalPot)}</strong> |
                Split: {split.map(p => Math.round(p)).join('% / ')}%
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Place</TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell align="right">Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {places.map(p => (
                        <TableRow key={p.place}>
                            <TableCell>{p.place}</TableCell>
                            <TableCell>{p.player?.name ?? '—'}</TableCell>
                            <TableCell align="right">{currency(p.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    );
}
