import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTournament } from '../state/useTournament';

const formatCurrency = (n: number) => '$' + Math.round(n).toLocaleString();

export default function PayoutsTable() {
    const entryFee = useTournament(s => s.entryFee);
    const playerCount = useTournament(s => s.players.length);
    const payoutSplit = useTournament(s => s.payoutPercents);
    const { totalPot, payoutPool, places } = useTournament(s => s.payouts());
    const poolPercent = totalPot ? Math.round((payoutPool / totalPot) * 100) : 0;

    if (!playerCount) return null;

    return (
        <Stack spacing={1}>
            <Typography variant="h6">Payouts</Typography>
            <Typography variant="body2" color="text.secondary">
                {playerCount} players × ${entryFee} entry ={' '}
                <strong>{formatCurrency(totalPot)}</strong> | Payout pool ({poolPercent}%):{' '}
                <strong>{formatCurrency(payoutPool)}</strong> | Split:{' '}
                {payoutSplit.map(p => Math.round(p)).join('% / ')}%
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
                    {places.map(place => (
                        <TableRow key={place.place}>
                            <TableCell>{place.place}</TableCell>
                            <TableCell>{place.player?.name ?? '—'}</TableCell>
                            <TableCell align="right">{formatCurrency(place.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    );
}
