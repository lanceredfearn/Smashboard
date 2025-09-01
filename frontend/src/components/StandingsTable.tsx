import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTournament } from '@/state/useTournament';
import { exportCSV } from '@/utils/csv';

export default function StandingsTable() {
    const standingsList = useTournament(s => s.standings());
    const players = useTournament(s => s.players);

    if (!players.length) return null;

    const exportStandings = () => {
        const rows: string[][] = [
            ['Rank', 'Player', 'Pts Won', 'Pts Lost', 'Diff'],
            ...standingsList.map((player, i) => [
                String(i + 1),
                player.name,
                String(player.pointsWon),
                String(player.pointsLost),
                String(player.pointsWon - player.pointsLost),
            ]),
        ];
        exportCSV('standings.csv', rows);
    };

    return (
        <>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell>Pts Won</TableCell>
                        <TableCell>Pts Lost</TableCell>
                        <TableCell>Diff</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {standingsList.map((player, i) => (
                        <TableRow key={player.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.pointsWon}</TableCell>
                            <TableCell>{player.pointsLost}</TableCell>
                            <TableCell>{player.pointsWon - player.pointsLost}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button sx={{ mt: 1 }} onClick={exportStandings}>
                Export CSV
            </Button>
        </>
    );
}
