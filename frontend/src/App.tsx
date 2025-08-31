import {Container, Stack, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import SetupPanel from './components/SetupPanel';
import PlayerList from './components/PlayerList';
import RoundControls from './components/RoundControls';
import CourtsGrid from './components/CourtsGrid';
import StandingsTable from './components/StandingsTable';
import PayoutsTable from './components/PayoutsTable';
import {useTournament} from './state/useTournament';
import Panel from './components/Panel';
import '../index.css'

"use client";
import {TypewriterEffectSmooth} from "./components/ui/typewriter-effect";
import {Meteors} from "./components/ui/meteors";

const words = [
    {
        text: "King",
        className: "text-blue-500 dark:text-blue-500"
    },
    {
        text: "of",
        className: "text-blue-500 dark:text-blue-500"
    },
    {
        text: "the",
        className: "text-blue-500 dark:text-blue-500"
    },
    {
        text: "Court",
        className: "text-blue-500 dark:text-blue-500"
    }
]

export default function App() {
    const {started, round, game, totalRounds} = useTournament(s => ({
        started: s.started,
        round: s.round,
        game: s.game,
        totalRounds: s.totalRounds,
    }));

    const standingsLabel = started
        ? `– Round ${round}, Game ${game}`
        : round >= totalRounds && round > 0
            ? '– Final Results'
            : '';

    return (
        <div style={{position: 'relative', minHeight: '100vh'}}>
            <div style={{position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden'}}>
                <Meteors number={30} />
            </div>

            <Stack spacing={2} sx={{mb: 6}}>
                <div style={{alignSelf: 'center'}}>
                    <TypewriterEffectSmooth words={words}/>
                </div>
                <Typography style={{alignSelf: 'center'}} variant="body2" color="text.secondary">
                    Winner-up / loser-down (Ct 1 winners & top-court losers stay). Partner
                    mixing reduces repeat partners. Data persists in your browser.
                </Typography>
            </Stack>

            <Grid container spacing={2}>
                <Grid padding={5} xs={12} md={4}>
                    <Panel>
                        <SetupPanel/>
                    </Panel>
                    <Panel sx={{mt: 2}}>
                        <PlayerList/>
                    </Panel>
                </Grid>

                <Grid padding={5} xs={12} md={8}>
                    <Panel>
                        <RoundControls/>
                        {!started && (
                            <Typography mt={2} color="text.secondary">
                                Add 12-40 players (multiple of 4), set rounds, then Start Tournament.
                            </Typography>
                        )}
                        <CourtsGrid/>
                    </Panel>

                    <Panel sx={{mt: 2}}>
                        <Typography variant="h6" gutterBottom>
                            Standings {standingsLabel}
                        </Typography>
                        <StandingsTable/>
                    </Panel>

                    <Panel sx={{mt: 2}}>
                        <PayoutsTable/>
                    </Panel>
                </Grid>
            </Grid>
        </div>
    );
}
