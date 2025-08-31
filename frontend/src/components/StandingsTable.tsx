import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTournament } from '@/state/useTournament';
import { exportCSV } from '@/utils/csv';

export default function StandingsTable() {
    const standingsList = useTournament(s => s.standings());
    const players = useTournament(s => s.players);

    if (!players.length) return null;

    const exportStandings = () => {
        const rows: string[][] = [
            ['Rank', 'Player', 'Points', 'Wins', 'Losses', 'Court1 Finishes'],
            ...standingsList.map((player, i) => [
                String(i + 1),
                player.name,
                String(player.points),
                String(player.wins),
                String(player.losses),
                String(player.court1Finishes),
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
                        <TableCell>Wins</TableCell>
                        <TableCell>Losses</TableCell>
                        <TableCell>Ct1</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {standingsList.map((player, i) => (
                        <TableRow key={player.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.points}</TableCell>
                            <TableCell>{player.wins}</TableCell>
                            <TableCell>{player.losses}</TableCell>
                            <TableCell>{player.court1Finishes}</TableCell>
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
