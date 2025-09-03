export type ResultMark = 'A' | 'B';

export type Player = {
  id: string;
  name: string;
  /** Total points scored by the player */
  pointsWon: number;
  /** Total points opponents earned against the player */
  pointsLost: number;
  rating: number;
  court1Finishes: number;
  lastPartnerId: string | null;
  /** IDs of partners played with in the current round */
  partnerHistory: string[];
  history: Array<{ round: number; court: number; game: number; team: 'A' | 'B'; result: 'W' | 'L' }>;
  /** Whether this player paid the buy-in for Moneyball */
  buyIn?: boolean;
};

export type CourtGame = {
  court: number;
  round: number;
  game: number;
  teamA: string[];
  teamB: string[];
  scoreA: number;
  scoreB: number;
  result: ResultMark;
  bestPlayerId: string;
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
  /** Completed games for this court */
  history: CourtGame[];
};

export type TournamentState = {
  players: Player[];
  courts: CourtState[];
  round: number;
  totalRounds: number;
  entryFee: number;
  /** Buy-in amount for Moneyball tournaments */
  buyInFee: number;
  started: boolean;
  maxCourts: number;
  matches: CourtGame[];
};

export type CourtPayout = {
  /** Court number for the prize */
  court: number;
  /** Display name of the prize */
  crown: string;
  /** Winning player for the court */
  player?: Player;
  /** Total payout amount */
  amount: number;
};

export type Announcement = {
  /** Unique id for the announcement */
  id: string;
  /** Tournament identifier (e.g. SNL or SMB) */
  tournament: string;
  /** ISO date when the announcement was created */
  date: string;
  /** Top players and their final scores */
  winners: Array<{ name: string; score: number }>;
};
