import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './App.css';
import Editor from './components/Editor';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <div className="app-container">
          <Editor />
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default App;
