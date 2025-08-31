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
    markCourtResult: (court: number, result: ResultMark) => void;
    clearRoundResults: () => void;
    nextRound: () => void;
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
            totalRounds: 8,
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
                totalRounds: 8,
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
                return (
                    !s.started &&
                    s.players.length >= 12 &&
                    s.players.length % 4 === 0 &&
                    s.players.length <= 40 &&
                    get().requiredCourts() > 0
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

            markCourtResult: (court, result) =>
                set((s) => {
                    const courts = s.courts.map(c => (c.court === court ? { ...c, result } : c));
                    return { ...s, courts };
                }),

            clearRoundResults: () =>
                set((s) => ({ ...s, courts: s.courts.map(c => ({ ...c, result: undefined })) })),

            nextRound: () =>
                set((s) => {
                    if (!s.started) return s;
                    if (!s.courts.every(c => c.result)) return s;

                    // Update stats and payouts
                    for (const court of s.courts) {
                        const res = court.result as ResultMark;
                        const a = court.teamA.map(get().getPlayer);
                        const b = court.teamB.map(get().getPlayer);

                        const winners = res === 'A' ? a : b;
                        const losers = res === 'A' ? b : a;

                        winners.forEach(p => {
                            p.points += 2;
                            p.wins++;
                            p.pointsWon += 2;
                            p.history.push({ round: s.round, court: court.court, team: res, result: 'W' });
                        });
                        losers.forEach(p => {
                            p.losses++;
                            p.pointsLost += 2;
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

                    const final = s.round >= s.totalRounds;
                    const nextCourts = final ? s.courts : moveAndReform(s.courts, get().getPlayer);

                    return {
                        ...s,
                        courts: nextCourts.map(c => ({ ...c, result: undefined })),
                        round: final ? s.round : s.round + 1,
                        started: final ? false : s.started
                    };
                }),

            standings: () => {
                const s = get();
                const clone = s.players.slice();
                clone.sort((a, b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    if (b.wins !== a.wins) return b.wins - a.wins;
                    if (b.court1Finishes !== a.court1Finishes) return b.court1Finishes - a.court1Finishes;
                    return a.name.localeCompare(b.name);
                });
                return clone;
            },

            payouts: () => {
                const s = get();
                const totalPot = s.players.length * s.entryFee;
                const payoutPool = totalPot * 0.5;
                const payoutPercents = [50, 30, 20];
                const places = payoutPercents.map((pct, i) => ({
                    place: i + 1,
                    player: get().standings()[i],
                    amount: Math.round(payoutPool * (pct / 100))
                }));
                return { totalPot, payoutPool, places };
            }
        }),
        { name: 'kotc10' }
    )
);
