import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CourtState, Player, ResultMark, TournamentState } from '../types';
import { seedInitialCourts, moveAndReform } from '../utils/rotation';

const generateId = () =>
    (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

type Store = TournamentState & {
    addPlayer: (name: string, rating: number) => void;
    removePlayer: (id: string) => void;
    reset: () => void;
    setConfig: (cfg: Partial<Pick<TournamentState,
        'maxCourts' | 'totalRounds' | 'entryFee'>>) => void;
    startTournament: () => void;
    markCourtResult: (court: number, scores: { scoreA?: number; scoreB?: number }) => void;
    submitCourt: (court: number) => void;
    clearRoundResults: () => void;
    nextGame: () => void;
    standings: () => Player[];
    payouts: () => { totalPot: number; payoutPool: number; places: Array<{ place: number; player?: Player; amount: number }> };
    canStart: () => boolean;
    requiredCourts: () => number;
    getPlayer: (id: string) => Player;
};

export const useTournament = create<Store>()(
    persist(
        (set, get) => ({
            players: [],
            courts: [],
            round: 0,
            game: 0,
            totalRounds: 3,
            entryFee: 30,
            started: false,
            maxCourts: 10,

            addPlayer: (name, rating) =>
                set((s) => {
                    if (s.started) return s;
                    const exists = s.players.some(p => p.name.toLowerCase() === name.toLowerCase());
                    if (exists || s.players.length >= 40) return s;
                    const p: Player = {
                        id: generateId(),
                        name,
                        points: 0,
                        wins: 0,
                        losses: 0,
                        pointsWon: 0,
                        pointsLost: 0,
                        balance: 0,
                        rating,
                        court1Finishes: 0,
                        lastPartnerId: null,
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
                game: 0,
                totalRounds: 3,
                entryFee: 30,
                started: false,
                maxCourts: 10
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
                    return { ...s, courts: grid, started: true, round: 1, game: 1 };
                }),

            markCourtResult: (court, scores) =>
                set((s) => {
                    const courts = s.courts.map(c => (c.court === court ? { ...c, ...scores } : c));
                    return { ...s, courts };
                }),

            submitCourt: (court) =>
                set((s) => {
                    const courts = s.courts.map(c => {
                        if (c.court !== court) return c;
                        const valid =
                            c.scoreA !== undefined &&
                            c.scoreB !== undefined &&
                            ((c.scoreA >= 11 || c.scoreB >= 11) && Math.abs(c.scoreA - c.scoreB) >= 2);
                        return valid ? { ...c, submitted: true } : c;
                    });
                    return { ...s, courts };
                }),

            clearRoundResults: () =>
                set((s) => ({ ...s, courts: s.courts.map(c => ({ ...c, scoreA: undefined, scoreB: undefined, submitted: false })) })),

            nextGame: () =>
                set((s) => {
                    if (!s.started) return s;
                    const valid = s.courts.every(c => c.submitted);
                    if (!valid) return s;

                    // Update stats and payouts
                    for (const court of s.courts) {
                        const scoreA = court.scoreA!;
                        const scoreB = court.scoreB!;
                        const res: ResultMark = scoreA > scoreB ? 'A' : 'B';
                        const a = court.teamA.map(get().getPlayer);
                        const b = court.teamB.map(get().getPlayer);

                        const winners = res === 'A' ? a : b;
                        const losers = res === 'A' ? b : a;
                        const winnerScore = res === 'A' ? scoreA : scoreB;
                        const loserScore = res === 'A' ? scoreB : scoreA;

                        winners.forEach(p => {
                            p.points += 2;
                            p.wins++;
                            p.pointsWon += winnerScore;
                            p.pointsLost += loserScore;
                            p.history.push({ round: s.round, court: court.court, team: res, result: 'W' });
                        });
                        losers.forEach(p => {
                            p.losses++;
                            p.pointsWon += loserScore;
                            p.pointsLost += winnerScore;
                            p.history.push({ round: s.round, court: court.court, team: res === 'A' ? 'B' : 'A', result: 'L' });
                        });

                        if (court.court === 1) {
                            winners.forEach(p => p.court1Finishes++);
                        }

                        // determine best player for payout
                        const bestPlayer = court.court === 1
                            ? get().players.reduce((best, cur) => (cur.rating > best.rating ? cur : best), get().players[0])
                            : [...a, ...b].reduce((best, cur) => (cur.rating > best.rating ? cur : best));

                        winners.forEach(p => { p.balance -= 1; });
                        bestPlayer.balance += winners.length;

                        // track last partners
                        const [a0, a1] = court.teamA;
                        const [b0, b1] = court.teamB;
                        const pa0 = get().getPlayer(a0); pa0.lastPartnerId = a1;
                        const pa1 = get().getPlayer(a1); pa1.lastPartnerId = a0;
                        const pb0 = get().getPlayer(b0); pb0.lastPartnerId = b1;
                        const pb1 = get().getPlayer(b1); pb1.lastPartnerId = b0;
                    }

                    let game = s.game + 1;
                    let round = s.round;
                    let started = s.started;
                    if (game > 3) {
                        game = 1;
                        round += 1;
                        if (round > s.totalRounds) {
                            round = s.totalRounds;
                            started = false;
                        }
                    }

                    const final = !started;
                    const nextCourts = final ? s.courts : moveAndReform(s.courts, get().getPlayer);

                    return {
                        ...s,
                        courts: nextCourts.map(c => ({ ...c, scoreA: undefined, scoreB: undefined, submitted: false })),
                        round,
                        game,
                        started,
                    };
                }),

            standings: () => {
                const s = get();
                const clone = s.players.slice();
                clone.sort((a, b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    const diffA = a.pointsWon - a.pointsLost;
                    const diffB = b.pointsWon - b.pointsLost;
                    if (diffB !== diffA) return diffB - diffA;
                    if (b.wins !== a.wins) return b.wins - a.wins;
                    if (b.court1Finishes !== a.court1Finishes) return b.court1Finishes - a.court1Finishes;
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
                const standings = get().standings();

                let pool = totalPot - houseCut;
                // refund entry fees to all court winners
                const refunds = courts * s.entryFee;
                pool -= refunds;
                if (pool < 0) pool = 0;

                const weights = [0.5, 0.3, 0.2];
                const places = Array.from({ length: courts }, (_, i) => {
                    let extra = 0;
                    if (i < 3) {
                        extra = pool * weights[i];
                    }
                    return {
                        place: i + 1,
                        player: standings[i],
                        amount: s.entryFee + extra,
                    };
                });

                const payoutPool = places.reduce((sum, p) => sum + p.amount, 0);
                return { totalPot, payoutPool, places };
            }
        }),
        { name: 'kotc10' }
    )
);
