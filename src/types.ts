export type ResultMark = 'A' | 'B' | 'T';

export type Player = {
  id: string;
  name: string;
  points: number;
  wins: number;
  losses: number;
  ties: number;
  court1Finishes: number;
  lastPartnerId: string | null;
  history: Array<{ round: number; court: number; team: 'A' | 'B'; result: 'W' | 'L' | 'T' }>;
};

export type CourtState = {
  court: number;
  teamA: string[];
  teamB: string[];
  result?: ResultMark;
};

export type TournamentState = {
  players: Player[];
  courts: CourtState[];
  round: number;
  totalRounds: number;
  entryFee: number;
  payoutPercents: number[];
  roundSeconds: number;
  started: boolean;
  maxCourts: number;
  timerEndsAt?: number;
};
