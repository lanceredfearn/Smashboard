import { Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import SetupPanel from './components/SetupPanel';
import PlayerList from './components/PlayerList';
import RoundControls from './components/RoundControls';
import CourtsGrid from './components/CourtsGrid';
import StandingsTable from './components/StandingsTable';
import PayoutsTable from './components/PayoutsTable';
import { useTournament } from './state/useTournament';
import Panel from './components/Panel';

export default function App() {
  const { started, round, totalRounds } = useTournament(s => ({
    started: s.started,
    round: s.round,
    totalRounds: s.totalRounds,
  }));

  const standingsLabel = started
    ? `– Round ${round} of ${totalRounds}`
    : round >= totalRounds && round > 0
      ? '– Final Results'
      : '';

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          King-of-the-Court Tournament (10 Courts)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Winner-up / loser-down (Ct 1 winners & top-court losers stay). Partner
          mixing reduces repeat partners. Data persists in your browser.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Panel>
            <SetupPanel />
          </Panel>
          <Panel sx={{ mt: 2 }}>
            <PlayerList />
          </Panel>
        </Grid>

        <Grid xs={12} md={8}>
          <Panel>
            <RoundControls />
            {!started && (
              <Typography mt={2} color="text.secondary">
                Add 12-40 players (multiple of 4), set rounds, then Start Tournament.
              </Typography>
            )}
            <CourtsGrid />
          </Panel>

          <Panel sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Standings {standingsLabel}
            </Typography>
            <StandingsTable />
          </Panel>

          <Panel sx={{ mt: 2 }}>
            <PayoutsTable />
          </Panel>
        </Grid>
      </Grid>
    </Container>
  );
}
