import type { CourtState, Player, ResultMark } from '../types';

export function seedInitialCourts(players: Player[], courts: number): CourtState[] {
    const sorted = players.slice().sort((a, b) => b.rating - a.rating);
    const grid: CourtState[] = [];
    for (let c = 1; c <= courts; c++) {
        const base = (c - 1) * 4;
        const group = sorted.slice(base, base + 4);
        if (group.length < 4) break;
        const teamA = [group[0].id, group[3].id];
        const teamB = [group[1].id, group[2].id];
        grid.push({ court: c, teamA, teamB });
    }
    return grid;
}

export function formTeamsAvoidingRepeat(
    participants: string[],
    getP: (id: string) => Player
): { A: string[]; B: string[] } {
    if (participants.length !== 4) {
        return { A: participants.slice(0, 2), B: participants.slice(2, 4) };
    }
    const perms: string[][] = [
        [participants[0], participants[1], participants[2], participants[3]],
        [participants[0], participants[2], participants[1], participants[3]],
        [participants[0], participants[3], participants[1], participants[2]],
    ];
    const score = (p: string[]) => {
        const a = [p[0], p[1]], b = [p[2], p[3]];
        const p0 = getP(a[0]).lastPartnerId === a[1] ? 1 : 0;
        const p1 = getP(a[1]).lastPartnerId === a[0] ? 1 : 0;
        const p2 = getP(b[0]).lastPartnerId === b[1] ? 1 : 0;
        const p3 = getP(b[1]).lastPartnerId === b[0] ? 1 : 0;
        return p0 + p1 + p2 + p3;
    };
    let best = perms[0], bestScore = score(perms[0]);
    for (let i = 1; i < perms.length; i++) {
        const s = score(perms[i]);
        if (s < bestScore) { best = perms[i]; bestScore = s; }
    }
    return { A: [best[0], best[1]], B: [best[2], best[3]] };
}

export function moveAndReform(
    courts: CourtState[],
    getP: (id: string) => Player
): CourtState[] {
    const top = courts.length;
    const arrivals: Record<number, string[]> = {};

    for (const c of courts) {
        const res = c.result as ResultMark;
        const winners = res === 'A' ? c.teamA : c.teamB;
        const losers = res === 'A' ? c.teamB : c.teamA;

        const winTarget = c.court === 1 ? 1 : c.court - 1;
        const loseTarget = c.court === top ? top : c.court + 1;

        arrivals[winTarget] = (arrivals[winTarget] ?? []).concat(winners);
        arrivals[loseTarget] = (arrivals[loseTarget] ?? []).concat(losers);
    }

    const next: CourtState[] = [];
    for (let c = 1; c <= top; c++) {
        const ids = arrivals[c] ?? [];
        if (ids.length !== 4) {
            const prev = courts.find(k => k.court === c)!;
            next.push({ court: c, teamA: prev.teamA.slice(), teamB: prev.teamB.slice() });
            continue;
        }
        const { A, B } = formTeamsAvoidingRepeat(ids, getP);
        next.push({ court: c, teamA: A, teamB: B });
    }
    return next;
}
