import { Container, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SetupPanel from './components/SetupPanel';
import PlayerList from './components/PlayerList';
import TimerControls from './components/TimerControls';
import CourtsGrid from './components/CourtsGrid';
import StandingsTable from './components/StandingsTable';
import PayoutsTable from './components/PayoutsTable';
import { useTournament } from './state/useTournament';

export default function App() {
  const started = useTournament(s => s.started);
  const round = useTournament(s => s.round);
  const totalRounds = useTournament(s => s.totalRounds);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          King-of-the-Court Tournament (10 Courts)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Winner-up / loser-down (Ct 1 winners & top-court losers stay). Partner mixing reduces repeat partners. Data persists in your browser.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <SetupPanel />
          </Paper>
          <Paper sx={{ p: 2, mt: 2 }}>
            <PlayerList />
          </Paper>
        </Grid>

        <Grid xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <TimerControls />
            {!started && (
              <Typography mt={2} color="text.secondary">
                Add players (multiple of 4), set rounds, then Start Tournament.
              </Typography>
            )}
            <CourtsGrid />
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Standings {started ? `– Round ${round} of ${totalRounds}` : ''}
            </Typography>
            <StandingsTable />
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <PayoutsTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
