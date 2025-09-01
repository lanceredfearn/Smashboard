import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import "../index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { Pickleballs } from '@/components/ui/pickleballs';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
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
                        <Pickleballs number={30} />
                    </div>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/snl" element={<App />} />
                        <Route path="/smb" element={<App />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
