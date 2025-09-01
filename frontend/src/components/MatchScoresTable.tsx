import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTournament } from '@/state/useTournament';
import { useMemo } from 'react';

export default function MatchScoresTable() {
    const matches = useTournament(s => s.matches);
    const players = useTournament(s => s.players);

    const nameMap = useMemo(() => {
        const map: Record<string, string> = {};
        players.forEach(p => { map[p.id] = p.name; });
        return map;
    }, [players]);

    if (!matches.length) return null;

    const formatTeam = (ids: string[]) => ids.map(id => nameMap[id] ?? 'Unknown').join(' & ');

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Match Scores
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Round</TableCell>
                        <TableCell>Court</TableCell>
                        <TableCell>Game</TableCell>
                        <TableCell>Team A</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Team B</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {matches.map((m, i) => (
                        <TableRow key={i}>
                            <TableCell>{m.round}</TableCell>
                            <TableCell>{m.court}</TableCell>
                            <TableCell>{m.game}</TableCell>
                            <TableCell>{formatTeam(m.teamA)}</TableCell>
                            <TableCell>{m.scoreA} - {m.scoreB}</TableCell>
                            <TableCell>{formatTeam(m.teamB)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
