export type ResultMark = 'A' | 'B';

export type Player = {
  id: string;
  name: string;
  /** Total points scored by the player */
  pointsWon: number;
  /** Total points opponents earned against the player */
  pointsLost: number;
  /** Net payout balance for the player */
  balance: number;
  rating: number;
  court1Finishes: number;
  lastPartnerId: string | null;
  /** IDs of partners played with in the current round */
  partnerHistory: string[];
  history: Array<{ round: number; court: number; team: 'A' | 'B'; result: 'W' | 'L' }>;
};

export type CourtState = {
  court: number;
  teamA: string[];
  teamB: string[];
  /** Current game within the round (1-indexed) */
  game: number;
  /** Points scored by team A */
  scoreA?: number;
  /** Points scored by team B */
  scoreB?: number;
  /** Whether this court's result has been submitted */
  submitted: boolean;
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
