import type { CourtState, Player, ResultMark } from '../types';

export function seedInitialCourts(players: Player[], courts: number): CourtState[] {
    // Seed players across courts in rating order. The highest-rated
    // player goes to court 1, the next to court 2, etc. until each court
    // has four players. Within a court we pair 1&4 vs 2&3 for the first match.
    const sorted = players.slice().sort((a, b) => b.rating - a.rating);

    // Distribute players to courts round-robin style based on seed order.
    const assignments: Record<number, string[]> = {};
    for (let i = 0; i < sorted.length; i++) {
        const court = (i % courts) + 1;
        assignments[court] = (assignments[court] ?? []).concat(sorted[i].id);
    }

    const grid: CourtState[] = [];
    for (let c = 1; c <= courts; c++) {
        const ids = assignments[c] ?? [];
        if (ids.length < 4) break;
        const teamA = [ids[0], ids[3]];
        const teamB = [ids[1], ids[2]];
        grid.push({ court: c, teamA, teamB, submitted: false, game: 1 });
    }
    return grid;
}

export function formTeamsAvoidingRepeat(
    participants: string[],
    getPlayer: (id: string) => Player
): { A: string[]; B: string[] } {
    if (participants.length !== 4) {
        return { A: participants.slice(0, 2), B: participants.slice(2, 4) };
    }
    const permutations: string[][] = [
        [participants[0], participants[1], participants[2], participants[3]],
        [participants[0], participants[2], participants[1], participants[3]],
        [participants[0], participants[3], participants[1], participants[2]],
    ];
    const penalty = (id1: string, id2: string) => {
        const p = getPlayer(id1);
        return p.lastPartnerId === id2 || p.partnerHistory.includes(id2) ? 1 : 0;
    };
    const score = (combo: string[]) => {
        const a = [combo[0], combo[1]];
        const b = [combo[2], combo[3]];
        const p0 = penalty(a[0], a[1]);
        const p1 = penalty(a[1], a[0]);
        const p2 = penalty(b[0], b[1]);
        const p3 = penalty(b[1], b[0]);
        return p0 + p1 + p2 + p3;
    };
    let best = permutations[0];
    let bestScore = score(permutations[0]);
    for (let i = 1; i < permutations.length; i++) {
        const s = score(permutations[i]);
        if (s < bestScore) {
            best = permutations[i];
            bestScore = s;
        }
    }
    return { A: [best[0], best[1]], B: [best[2], best[3]] };
}

export function moveAndReform(
    courts: CourtState[],
    getPlayer: (id: string) => Player
): CourtState[] {
    // Build the list of players ordered by their current overall standings
    // (total points won, point differential, then rating) so that the top
    // four occupy court 1, the next four court 2, etc.
    const players = courts
        .flatMap(c => [...c.teamA, ...c.teamB])
        .map(id => getPlayer(id));

    players.sort((a, b) => {
        if (b.pointsWon !== a.pointsWon) return b.pointsWon - a.pointsWon;
        const diffA = a.pointsWon - a.pointsLost;
        const diffB = b.pointsWon - b.pointsLost;
        if (diffB !== diffA) return diffB - diffA;
        return b.rating - a.rating;
    });

    const orderedIds = players.map(p => p.id);
    const totalCourts = courts.length;
    const next: CourtState[] = [];
    for (let i = 0; i < totalCourts; i++) {
        const ids = orderedIds.slice(i * 4, i * 4 + 4);
        if (ids.length < 4) {
            const prev = courts.find(k => k.court === i + 1)!;
            next.push({ court: i + 1, teamA: prev.teamA.slice(), teamB: prev.teamB.slice(), submitted: false, game: 1 });
            continue;
        }
        const { A, B } = formTeamsAvoidingRepeat(ids, getPlayer);
        next.push({ court: i + 1, teamA: A, teamB: B, submitted: false, game: 1 });
    }
    return next;
}
