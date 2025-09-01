import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTournament } from '../state/useTournament';

const formatCurrency = (n: number) => '$' + Math.round(n).toLocaleString();

export default function PayoutsTable() {
    const location = useLocation();
    const isSmb = location.pathname.startsWith('/smb');
    const fee = useTournament(s => (isSmb ? s.buyInFee : s.entryFee));
    const playerCount = useTournament(s =>
        isSmb ? s.players.filter(p => p.buyIn).length : s.players.length
    );
    const { totalPot, payoutPool, awards } = useTournament(s =>
        isSmb ? s.moneyballPayouts() : s.payouts()
    );
    const poolPercent = totalPot ? Math.round((payoutPool / totalPot) * 100) : 0;

    if (!playerCount) return null;

    return (
        <Stack spacing={1}>
            <Typography variant="h6">Payouts</Typography>
            <Typography variant="body2" color="text.secondary">
                {playerCount} players × ${fee} {isSmb ? 'buy-in' : 'entry'} ={' '}
                <strong>{formatCurrency(totalPot)}</strong> | Payout pool ({poolPercent}%):{' '}
                <strong>{formatCurrency(payoutPool)}</strong>
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>{isSmb ? 'Place' : 'Crown'}</TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell align="right">Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {awards.map(a => (
                        <TableRow key={isSmb ? a.place : a.court}>
                            <TableCell>{isSmb ? `${a.place}º` : a.crown}</TableCell>
                            <TableCell>{a.player?.name ?? '—'}</TableCell>
                            <TableCell align="right">{formatCurrency(a.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    );
}
