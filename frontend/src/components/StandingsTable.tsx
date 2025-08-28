import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTournament } from '../state/useTournament';
import { exportCSV } from '../utils/csv';

export default function StandingsTable() {
    const standingsList = useTournament(s => s.standings());
    const players = useTournament(s => s.players);

    if (!players.length) return null;

    const exportStandings = () => {
        const rows: string[][] = [
            ['Rank', 'Player', 'Points', 'W', 'L', 'Court1 Finishes'],
            ...standingsList.map((p, i) => [
                String(i + 1),
                p.name,
                String(p.points),
                String(p.wins),
                String(p.losses),
                String(p.court1Finishes),
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
                        <TableCell>Pts</TableCell>
                        <TableCell>W</TableCell>
                        <TableCell>L</TableCell>
                        <TableCell>Ct1</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {standingsList.map((p, i) => (
                        <TableRow key={p.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.points}</TableCell>
                            <TableCell>{p.wins}</TableCell>
                            <TableCell>{p.losses}</TableCell>
                            <TableCell>{p.court1Finishes}</TableCell>
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
