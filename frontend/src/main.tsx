import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import "../index.css";
import { Meteors } from "@/components/ui/meteors";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ position: 'relative', minHeight: '100vh' }}>
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: -1,
                        overflow: 'hidden',
                        background: 'black',
                    }}
                >
                    <Meteors number={30} />
                </div>
                <App />
            </div>
        </ThemeProvider>
    </React.StrictMode>
);
