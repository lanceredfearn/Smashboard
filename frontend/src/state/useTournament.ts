import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CourtState, Player, ResultMark, TournamentState, CourtPayout, CourtGame } from '@/types';
import { seedInitialCourts, moveAndReform, formTeamsAvoidingRepeat } from '@/utils/rotation';

const generateId = () =>
    (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const GAMES_PER_ROUND = 3;

interface Store extends TournamentState {
    matches: never[];
    addPlayer: (name: string, rating: number) => void;
    removePlayer: (id: string) => void;
    reset: () => void;
    setConfig: (cfg: Partial<Pick<TournamentState,
        'maxCourts' | 'totalRounds' | 'entryFee'>>) => void;
    startTournament: () => void;
    markCourtResult: (court: number, scores: { scoreA?: number; scoreB?: number }) => void;
    editGameScore: (court: number, game: number, scores: { scoreA?: number; scoreB?: number }) => void;
    submitCourt: (court: number) => void;
    submitRound: () => void;
    standings: () => Player[];
    payouts: () => { totalPot: number; payoutPool: number; awards: CourtPayout[] };
    canStart: () => boolean;
    requiredCourts: () => number;
    getPlayer: (id: string) => Player;
}

export const useTournament = create<Store>()(
    persist(
        (set, get) => ({
            players: [],
            courts: [],
            round: 0,
            totalRounds: 3,
            entryFee: 30,
            started: false,
            maxCourts: 10,
            matches: [],

            addPlayer: (name, rating) =>
                set((s) => {
                    if (s.started) return s;
                    const exists = s.players.some(p => p.name.toLowerCase() === name.toLowerCase());
                    if (exists || s.players.length >= 40) return s;
                    const p: Player = {
                        id: generateId(),
                        name,
                        pointsWon: 0,
                        pointsLost: 0,
                        rating,
                        court1Finishes: 0,
                        lastPartnerId: null,
                        partnerHistory: [],
                        history: []
                    };
                    return { ...s, players: [...s.players, p] };
                }),

            removePlayer: (id) =>
                set((s) => {
                    if (s.started) return s;
                    return { ...s, players: s.players.filter(p => p.id !== id) };
                }),

            reset: () => set(() => ({
                players: [],
                courts: [],
                round: 0,
                totalRounds: 3,
                entryFee: 30,
                started: false,
                maxCourts: 10,
                matches: []
            })),

            setConfig: cfg =>
                set(s => ({
                    ...s,
                    ...cfg,
                })),

            requiredCourts: () => {
                const s = get();
                return Math.min(s.maxCourts, Math.floor(s.players.length / 4));
            },

            canStart: () => {
                const s = get();
                const count = s.players.length;
                return (
                    !s.started &&
                    count >= 12 &&
                    count <= 40 &&
                    count % 4 === 0
                );
            },

            getPlayer: (id: string) => {
                const player = get().players.find(x => x.id === id);
                if (!player) throw new Error('player not found');
                return player;
            },

            startTournament: () =>
                set((s) => {
                    if (s.started) return s;
                    const courts = get().requiredCourts();
                    if (courts < 1 || s.players.length % 4 !== 0) return s;
                    const grid = seedInitialCourts(s.players, courts);
                    return { ...s, courts: grid, started: true, round: 1 };
                }),

            markCourtResult: (court, scores) =>
                set((s) => {
                    const courts = s.courts.map(c => {
                        if (c.court !== court) return c;
                        let scoreA = c.scoreA;
                        let scoreB = c.scoreB;
                        if (scores.scoreA !== undefined) {
                            const used = c.history.reduce((sum, g) => sum + g.scoreA, 0);
                            scoreA = Math.min(Math.max(0, scores.scoreA), 11, 33 - used);
                        }
                        if (scores.scoreB !== undefined) {
                            const used = c.history.reduce((sum, g) => sum + g.scoreB, 0);
                            scoreB = Math.min(Math.max(0, scores.scoreB), 11, 33 - used);
                        }
                        return { ...c, scoreA, scoreB };
                    });
                    return { ...s, courts };
                }),

            editGameScore: (courtNumber, gameNumber, scores) => {
                const gp = get().getPlayer;
                set((s) => {
                    let newMatch: CourtGame | null = null;
                    const courts = s.courts.map(c => {
                        if (c.court !== courtNumber) return c;
                        const idx = c.history.findIndex(h => h.game === gameNumber);
                        if (idx === -1) return c;
                        const entry = c.history[idx];
                        const otherASum = c.history.reduce((sum, g, i) => sum + (i === idx ? 0 : g.scoreA), 0);
                        const otherBSum = c.history.reduce((sum, g, i) => sum + (i === idx ? 0 : g.scoreB), 0);
                        let newA = scores.scoreA !== undefined ? scores.scoreA : entry.scoreA;
                        let newB = scores.scoreB !== undefined ? scores.scoreB : entry.scoreB;
                        newA = Math.min(Math.max(0, newA), 11, 33 - otherASum);
                        newB = Math.min(Math.max(0, newB), 11, 33 - otherBSum);
                        const oldA = entry.scoreA;
                        const oldB = entry.scoreB;
                        const oldRes: ResultMark = entry.result;
                        const newRes: ResultMark = newA > newB ? 'A' : 'B';
                        const aPlayers = entry.teamA.map(gp);
                        const bPlayers = entry.teamB.map(gp);
                        const winnersOld = oldRes === 'A' ? aPlayers : bPlayers;
                        const losersOld = oldRes === 'A' ? bPlayers : aPlayers;
                        const winnerScoreOld = oldRes === 'A' ? oldA : oldB;
                        const loserScoreOld = oldRes === 'A' ? oldB : oldA;
                        winnersOld.forEach(p => {
                            p.pointsWon -= winnerScoreOld;
                            p.pointsLost -= loserScoreOld;
                            const h = p.history.find(h => h.round === entry.round && h.court === c.court && h.game === entry.game);
                            if (h) h.result = 'L';
                        });
                        losersOld.forEach(p => {
                            p.pointsWon -= loserScoreOld;
                            p.pointsLost -= winnerScoreOld;
                            const h = p.history.find(h => h.round === entry.round && h.court === c.court && h.game === entry.game);
                            if (h) h.result = 'W';
                        });
                        if (c.court === 1) {
                            winnersOld.forEach(p => p.court1Finishes--);
                        }

                        const winnersNew = newRes === 'A' ? aPlayers : bPlayers;
                        const losersNew = newRes === 'A' ? bPlayers : aPlayers;
                        const winnerScoreNew = newRes === 'A' ? newA : newB;
                        const loserScoreNew = newRes === 'A' ? newB : newA;
                        winnersNew.forEach(p => {
                            p.pointsWon += winnerScoreNew;
                            p.pointsLost += loserScoreNew;
                            const h = p.history.find(h => h.round === entry.round && h.court === c.court && h.game === entry.game);
                            if (h) { h.team = newRes; h.result = 'W'; }
                        });
                        losersNew.forEach(p => {
                            p.pointsWon += loserScoreNew;
                            p.pointsLost += winnerScoreNew;
                            const h = p.history.find(h => h.round === entry.round && h.court === c.court && h.game === entry.game);
                            if (h) { h.team = newRes === 'A' ? 'B' : 'A'; h.result = 'L'; }
                        });
                        if (c.court === 1) {
                            winnersNew.forEach(p => p.court1Finishes++);
                        }

                        const updated = { ...entry, scoreA: newA, scoreB: newB, result: newRes };
                        const history = c.history.map((h, i) => (i === idx ? updated : h));
                        return { ...c, history };
                    });
                    return { ...s, courts };
                });
            },

            submitCourt: (courtNumber) => {
                const gp = get().getPlayer;
                set((s) => {
                    let newMatch: CourtGame | null = null;
                    const courts = s.courts.map(c => {
                        if (c.court !== courtNumber) return c;
                        const valid =
                            c.scoreA !== undefined &&
                            c.scoreB !== undefined &&
                            ((c.scoreA >= 11 || c.scoreB >= 11) && Math.abs(c.scoreA - c.scoreB) >= 2);
                        if (!valid) return c;

                        const scoreA = c.scoreA!;
                        const scoreB = c.scoreB!;
                        const res: ResultMark = scoreA > scoreB ? 'A' : 'B';
                        const aPlayers = c.teamA.map(gp);
                        const bPlayers = c.teamB.map(gp);
                        const winners = res === 'A' ? aPlayers : bPlayers;
                        const losers = res === 'A' ? bPlayers : aPlayers;
                        const winnerScore = res === 'A' ? scoreA : scoreB;
                        const loserScore = res === 'A' ? scoreB : scoreA;

                        winners.forEach(p => {
                            p.pointsWon += winnerScore;
                            p.pointsLost += loserScore;
                            p.history.push({ round: s.round, court: c.court, game: c.game, team: res, result: 'W' });
                        });
                        losers.forEach(p => {
                            p.pointsWon += loserScore;
                            p.pointsLost += winnerScore;
                            p.history.push({ round: s.round, court: c.court, game: c.game, team: res === 'A' ? 'B' : 'A', result: 'L' });
                        });

                        if (c.court === 1) {
                            winners.forEach(p => p.court1Finishes++);
                        }

                        const bestPlayer = c.court === 1
                            ? get().players.reduce((best, cur) => (cur.rating > best.rating ? cur : best), get().players[0])
                            : [...aPlayers, ...bPlayers].reduce((best, cur) => (cur.rating > best.rating ? cur : best));

                        const gameEntry: CourtGame = {
                            court: c.court,
                            round: s.round,
                            game: c.game,
                            teamA: c.teamA,
                            teamB: c.teamB,
                            scoreA,
                            scoreB,
                            result: res,
                            bestPlayerId: bestPlayer.id,
                        };
                        newMatch = gameEntry;

                        const [a0, a1] = c.teamA;
                        const [b0, b1] = c.teamB;
                        const pa0 = gp(a0); pa0.lastPartnerId = a1; pa0.partnerHistory.push(a1);
                        const pa1 = gp(a1); pa1.lastPartnerId = a0; pa1.partnerHistory.push(a0);
                        const pb0 = gp(b0); pb0.lastPartnerId = b1; pb0.partnerHistory.push(b1);
                        const pb1 = gp(b1); pb1.lastPartnerId = b0; pb1.partnerHistory.push(b0);

                        if (c.game < GAMES_PER_ROUND) {
                            const participants = [...c.teamA, ...c.teamB];
                            const { A, B } = formTeamsAvoidingRepeat(participants, gp);
                            return { court: c.court, teamA: A, teamB: B, submitted: false, game: c.game + 1, scoreA: undefined, scoreB: undefined, history: c.history.concat(gameEntry) };
                        }

                        return { ...c, submitted: true, scoreA: undefined, scoreB: undefined, history: c.history.concat(gameEntry) };
                    });

                    return { ...s, courts, matches: newMatch ? s.matches.concat(newMatch) : s.matches };
                });
            },

            submitRound: () => {
                set((s) => {
                    const courts = s.courts;
                    const roundDone = courts.every(c => c.submitted && c.game === GAMES_PER_ROUND);
                    if (!roundDone) return s;
                    let round = s.round + 1;
                    let started = s.started;
                    const players = s.players.map(p => ({ ...p, partnerHistory: [] }));
                    const gpRound = (id: string) => {
                        const player = players.find(x => x.id === id);
                        if (!player) throw new Error('player not found');
                        return player;
                    };
                    let nextCourts: CourtState[] = courts;
                    if (round > s.totalRounds) {
                        round = s.totalRounds;
                        started = false;
                    } else {
                        nextCourts = moveAndReform(courts, gpRound).map(c => ({ ...c, game: 1 }));
                    }
                    return {
                        ...s,
                        players,
                        courts: nextCourts.map(c => ({
                            ...c,
                            scoreA: undefined,
                            scoreB: undefined,
                            submitted: false,
                            history: [],
                        })),
                        round,
                        started,
                    };
                });
            },

            standings: () => {
                const s = get();
                const clone = s.players.slice();
                clone.sort((a, b) => {
                    if (b.pointsWon !== a.pointsWon) return b.pointsWon - a.pointsWon;
                    const diffA = a.pointsWon - a.pointsLost;
                    const diffB = b.pointsWon - b.pointsLost;
                    if (diffB !== diffA) return diffB - diffA;
                    return a.name.localeCompare(b.name);
                });
                return clone;
            },

            payouts: () => {
                const s = get();
                const totalPot = s.players.length * s.entryFee;
                const groupsOverTwelve = Math.max(0, Math.floor((s.players.length - 12) / 4));
                const houseCut = 100 + groupsOverTwelve * 25;
                const courts = get().requiredCourts();
                const gp = get().getPlayer;

                let pool = totalPot - houseCut;
                // refund entry fees to all court winners
                const refunds = courts * s.entryFee;
                pool -= refunds;
                if (pool < 0) pool = 0;

                const sortPlayers = (players: Player[]) => {
                    const clone = players.slice();
                    clone.sort((a, b) => {
                        if (b.pointsWon !== a.pointsWon) return b.pointsWon - a.pointsWon;
                        const diffA = a.pointsWon - a.pointsLost;
                        const diffB = b.pointsWon - b.pointsLost;
                        if (diffB !== diffA) return diffB - diffA;
                        return a.name.localeCompare(b.name);
                    });
                    return clone;
                };

                const weights = [0.5, 0.3, 0.2];
                const crowns = ["King's Crown", "Queen's Crown", "Jack's Crown"];
                const awards: CourtPayout[] = Array.from({ length: courts }, (_, i) => {
                    const courtNum = i + 1;
                    const court = s.courts.find(c => c.court === courtNum);
                    const participants = court ? [...court.teamA, ...court.teamB].map(gp) : [];
                    const winner = sortPlayers(participants)[0];
                    let extra = 0;
                    if (i < 3) {
                        extra = pool * weights[i];
                    }
                    const crown = i < 3 ? crowns[i] : "Jester's Crown";
                    return {
                        court: courtNum,
                        crown,
                        player: winner,
                        amount: s.entryFee + extra,
                    };
                });

                const payoutPool = awards.reduce((sum, p) => sum + p.amount, 0);
                return { totalPot, payoutPool, awards };
            }
        }),
        {
            name: 'kotc10',
            merge: (persisted: unknown, current: Store): Store => {
                const merged: Store = {
                    ...current,
                    ...(persisted as Partial<TournamentState>),
                }
                merged.players = (merged.players ?? []).map((p: Player) => ({
                    ...p,
                    partnerHistory: p.partnerHistory ?? [],
                    history: p.history ?? [],
                }));
                merged.courts = (merged.courts ?? []).map((c: CourtState) => ({
                    ...c,
                    history: c.history ?? [],
                }));
                merged.matches = merged.matches ?? [];
                return merged;
            },
        }
    )
);
