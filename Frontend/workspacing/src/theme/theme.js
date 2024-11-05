// src/theme/theme.js
import { createTheme } from '@mui/material/styles';
// Import Work Sans font in your theme.js or App.js file
import '@fontsource/work-sans'; // Defaults to weight 400


const theme = createTheme({
  palette: {
    primary: {
      main: '#00203F', // Customize your primary color
    },
    secondary: {
      main: '#ADEFD1', // Customize your secondary color
    },
    text: {
      primary: '#000000', // Set the default text color to black
      secondary: '#666666', // Optional: Set secondary text color for lighter text
    },
  },
  typography: {
    fontFamily: 'Work Sans, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#00203F', // Use primary color for big headings
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#00203F', // Use primary color for big headings
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#00203F', // Use primary color for big headings
    },
    body1: {
      color: '#000000', // Default text color for normal text
    },
    body2: {
      color: '#000000', // Default text color for smaller text
    },
    // Additional typography settings
  },
});

export default theme;
