import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { seedInitialCourts, formTeamsAvoidingRepeat, moveAndReform } from './rotation.js';
import type { Player, CourtState } from '../types';

function makePlayer(
  id: string,
  rating: number,
  pointsWon = 0,
  pointsLost = 0,
  lastPartnerId: string | null = null,
  partnerHistory: string[] = []
): Player {
  return {
    id,
    name: id,
    pointsWon,
    pointsLost,
    rating,
    court1Finishes: 0,
    lastPartnerId,
    partnerHistory,
    history: []
  };
}

test('seedInitialCourts seeds by rating and pairs 1&4 vs 2&3', () => {
  const players = [
    makePlayer('p1', 160),
    makePlayer('p2', 150),
    makePlayer('p3', 140),
    makePlayer('p4', 130)
  ];
  const courts = seedInitialCourts(players, 1);
  assert.equal(courts.length, 1);
  assert.deepEqual(courts[0].teamA, ['p1', 'p4']);
  assert.deepEqual(courts[0].teamB, ['p2', 'p3']);
});

test('formTeamsAvoidingRepeat chooses teams with fewest repeat partners', () => {
  const players = [
    makePlayer('p1', 0, 0, 0, 'p2'),
    makePlayer('p2', 0, 0, 0, 'p1'),
    makePlayer('p3', 0, 0, 0, null, ['p4']),
    makePlayer('p4', 0, 0, 0, null, ['p3'])
  ];
  const getPlayer = (id: string) => players.find(p => p.id === id)!;
  const result = formTeamsAvoidingRepeat(['p1', 'p2', 'p3', 'p4'], getPlayer);
  assert.deepEqual(result, { A: ['p1', 'p3'], B: ['p2', 'p4'] });
});

test('moveAndReform reorders players by standings and avoids repeat partners', () => {
  const players = [
    makePlayer('p1', 0, 10, 0, 'p2'),
    makePlayer('p2', 0, 9, 0, 'p1'),
    makePlayer('p3', 0, 8, 0, 'p4'),
    makePlayer('p4', 0, 7, 0, 'p3'),
    makePlayer('p5', 0, 12, 0, 'p6'),
    makePlayer('p6', 0, 11, 0, 'p5'),
    makePlayer('p7', 0, 6, 0, 'p8'),
    makePlayer('p8', 0, 5, 0, 'p7')
  ];
  const playerMap = new Map(players.map(p => [p.id, p]));
  const getPlayer = (id: string) => playerMap.get(id)!;
  const courts: CourtState[] = [
    { court: 1, teamA: ['p1', 'p2'], teamB: ['p3', 'p4'], submitted: false, game: 1, history: [] },
    { court: 2, teamA: ['p5', 'p6'], teamB: ['p7', 'p8'], submitted: false, game: 1, history: [] }
  ];
  const next = moveAndReform(courts, getPlayer);
  assert.deepEqual(next[0].teamA, ['p5', 'p1']);
  assert.deepEqual(next[0].teamB, ['p6', 'p2']);
  assert.deepEqual(next[1].teamA, ['p3', 'p7']);
  assert.deepEqual(next[1].teamB, ['p4', 'p8']);
});
