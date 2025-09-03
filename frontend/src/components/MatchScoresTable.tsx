import { Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTournament } from '@/state/useTournament';
import { useMemo, useState } from 'react';

export default function MatchScoresTable() {
    const matches = useTournament(s => s.matches);
    const players = useTournament(s => s.players);
    const editGame = useTournament(s => s.editGameScore);

    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [scoreA, setScoreA] = useState('');
    const [scoreB, setScoreB] = useState('');

    const nameMap = useMemo(() => {
        const map: Record<string, string> = {};
        players.forEach(p => { map[p.id] = p.name; });
        return map;
    }, [players]);

    if (!matches.length) return null;

    const formatTeam = (ids: string[]) => ids.map(id => nameMap[id] ?? 'Unknown').join(' & ');

    const startEdit = (idx: number) => {
        const m = matches[idx];
        setEditIdx(idx);
        setScoreA(String(m.scoreA));
        setScoreB(String(m.scoreB));
    };

    const cancelEdit = () => setEditIdx(null);

    const saveEdit = (idx: number) => {
        const m = matches[idx];
        editGame(m.round, m.court, m.game, { scoreA: Number(scoreA), scoreB: Number(scoreB) });
        setEditIdx(null);
    };

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
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {matches.map((m, i) => (
                        <TableRow key={i}>
                            <TableCell>{m.round}</TableCell>
                            <TableCell>{m.court}</TableCell>
                            <TableCell>{m.game}</TableCell>
                            <TableCell>{formatTeam(m.teamA)}</TableCell>
                            <TableCell>
                                {editIdx === i ? (
                                    <>
                                        <TextField
                                            size="small"
                                            value={scoreA}
                                            onChange={e => setScoreA(e.target.value)}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                            sx={{ width: 40 }}
                                        />
                                        {' - '}
                                        <TextField
                                            size="small"
                                            value={scoreB}
                                            onChange={e => setScoreB(e.target.value)}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 11 }}
                                            sx={{ width: 40 }}
                                        />
                                    </>
                                ) : (
                                    `${m.scoreA} - ${m.scoreB}`
                                )}
                            </TableCell>
                            <TableCell>{formatTeam(m.teamB)}</TableCell>
                            <TableCell>
                                {editIdx === i ? (
                                    <>
                                        <IconButton color="success" size="small" onClick={() => saveEdit(i)}>
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small" onClick={cancelEdit}>
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton size="small" onClick={() => startEdit(i)}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
