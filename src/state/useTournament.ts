import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CourtState, Player, ResultMark, TournamentState } from '../types';
import { seedInitialCourts, moveAndReform } from '../utils/rotation';

const uid = () =>
    (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

type Store = TournamentState & {
    addPlayer: (name: string, rating: number) => void;
    removePlayer: (id: string) => void;
    reset: () => void;
    setConfig: (cfg: Partial<Pick<TournamentState,
        'maxCourts' | 'totalRounds' | 'entryFee' | 'payoutPercents'>>) => void;
    startTournament: () => void;
    markCourtResult: (court: number, result: ResultMark) => void;
    clearRoundResults: () => void;
    nextRound: () => void;
    standings: () => Player[];
    payouts: () => { totalPot: number; places: Array<{ place: number; player?: Player; amount: number }> };
    canStart: () => boolean;
    requiredCourts: () => number;
    getP: (id: string) => Player;
};

const normalizeSplit = (arr: number[]) => {
    const positive = arr.filter(n => n > 0);
    const sum = positive.reduce((a, b) => a + b, 0);
    if (!sum) return [50, 30, 20];
    return positive.map(n => (n / sum) * 100);
};

export const useTournament = create<Store>()(
    persist(
        (set, get) => ({
            players: [],
            courts: [],
            round: 0,
            totalRounds: 8,
            entryFee: 30,
            payoutPercents: [50, 30, 20],
            started: false,
            maxCourts: 10,

            addPlayer: (name, rating) =>
                set((s) => {
                    if (s.started) return s;
                    const exists = s.players.some(p => p.name.toLowerCase() === name.toLowerCase());
                    if (exists || s.players.length >= 40) return s;
                    const p: Player = {
                        id: uid(),
                        name,
                        points: 0,
                        wins: 0,
                        losses: 0,
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
                payoutPercents: [50, 30, 20],
                started: false,
                maxCourts: 10
            })),

            setConfig: (cfg) =>
                set((s) => ({
                    ...s,
                    ...cfg,
                    payoutPercents: cfg.payoutPercents ? normalizeSplit(cfg.payoutPercents) : s.payoutPercents
                })),

            requiredCourts: () => {
                const s = get();
                return Math.min(s.maxCourts, Math.floor(s.players.length / 4));
            },

            canStart: () => {
                const s = get();
                return !s.started && s.players.length >= 12 && s.players.length % 4 === 0 &&
                    s.players.length <= 40 && get().requiredCourts() > 0;
            },

            getP: (id: string) => {
                const p = get().players.find(x => x.id === id);
                if (!p) throw new Error('player not found');
                return p;
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

                    // Update stats
                    for (const court of s.courts) {
                        const res = court.result as ResultMark;
                        const a = court.teamA.map(get().getP);
                        const b = court.teamB.map(get().getP);

                        if (res === 'A') {
                            a.forEach(p => { p.points += 2; p.wins++; p.history.push({ round: s.round, court: court.court, team: 'A', result: 'W' }) });
                            b.forEach(p => { p.losses++; p.history.push({ round: s.round, court: court.court, team: 'B', result: 'L' }) });
                        } else {
                            b.forEach(p => { p.points += 2; p.wins++; p.history.push({ round: s.round, court: court.court, team: 'B', result: 'W' }) });
                            a.forEach(p => { p.losses++; p.history.push({ round: s.round, court: court.court, team: 'A', result: 'L' }) });
                        }
                        if (court.court === 1) {
                            const winners = res === 'A' ? a : b;
                            winners.forEach(p => p.court1Finishes++);
                        }

                        // track last partners
                        const [a0, a1] = court.teamA;
                        const [b0, b1] = court.teamB;
                        const pa0 = get().getP(a0); pa0.lastPartnerId = a1;
                        const pa1 = get().getP(a1); pa1.lastPartnerId = a0;
                        const pb0 = get().getP(b0); pb0.lastPartnerId = b1;
                        const pb1 = get().getP(b1); pb1.lastPartnerId = b0;
                    }

                    const final = s.round >= s.totalRounds;
                    const nextCourts = final ? s.courts : moveAndReform(s.courts, get().getP);

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
                const places = s.payoutPercents.map((pct, i) => ({
                    place: i + 1,
                    player: get().standings()[i],
                    amount: Math.round(totalPot * (pct / 100))
                }));
                return { totalPot, places };
            }
        }),
        { name: 'kotc10' }
    )
);
