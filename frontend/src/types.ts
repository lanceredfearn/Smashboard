export type ResultMark = 'A' | 'B';

export type Player = {
  id: string;
  name: string;
  points: number;
  wins: number;
  losses: number;
  /** Total points earned from wins */
  pointsWon: number;
  /** Total points opponents earned against the player */
  pointsLost: number;
  /** Net payout balance for the player */
  balance: number;
  rating: number;
  court1Finishes: number;
  lastPartnerId: string | null;
  history: Array<{ round: number; court: number; team: 'A' | 'B'; result: 'W' | 'L' }>;
};

export type CourtState = {
  court: number;
  teamA: string[];
  teamB: string[];
  /** Points scored by team A */
  scoreA?: number;
  /** Points scored by team B */
  scoreB?: number;
};

export type TournamentState = {
  players: Player[];
  courts: CourtState[];
  round: number;
  totalRounds: number;
  entryFee: number;
  started: boolean;
  maxCourts: number;
};
