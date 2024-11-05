'use client'
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Box,
  Link as MuiLink,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import theme from '@/src/theme/theme';

// Add this import for animations
import { keyframes } from '@emotion/react';

// Define animations
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export default function MarketingPage() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: 'linear-gradient(45deg, #E7FFF4 10%, #00203F 90%)', color: 'white' }}>
        <AppBar position="static" color="transparent">
          <Toolbar>
            <img src="/logo.png" alt="WorkSpacing Logo" style={{ height: '60px' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: '#ADEFD1',
                textShadow: '0 0 8px rgba(173, 239, 209, 0.8), 0 0 12px rgba(173, 239, 209, 0.6)',
              }}
            >
              WorkSpacing
            </Typography>
            
            {/* Buttons for medium and larger screens */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit">Features</Button>
              <Button color="inherit">Pricing</Button>
              <Button color="inherit">About</Button>
              <Button color="inherit" onClick={() => window.location.href = '/sign-in'}>Login</Button>
                <Button color="secondary" variant="outlined" sx={{ ml: 1 }} onClick={() => window.location.href = '/sign-up'}>
                Register
                </Button>
            </Box>
            
            {/* Menu icon button for small screens */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
              >
                <MenuItem onClick={handleMenuClose}>
                  <Button color="inherit">Features</Button>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button color="inherit">Pricing</Button>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button color="inherit">About</Button>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button color="inherit" onClick={() => window.location.href = '/sign-in'}>Login</Button>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button color="inherit" onClick={() => window.location.href = '/sign-up'}>
                    Register
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Rest of the component */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: theme.spacing(4),
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              className="p-4"
              sx={{
                color: 'primary.main',
                textShadow: '0 0 8px rgba(173, 239, 209, 0.8), 0 0 12px rgba(173, 239, 209, 0.6)',
              }}
            >
              Welcome to <span style={{ color: '#ADEFD1' }}>WorkSpacing</span>
            </Typography>

            <Typography variant="h5" component="h4" gutterBottom>
              Discover a smarter way to manage your life and work—from personal schedules to team projects—unlocking new levels of collaboration and productivity.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                sx={{
                  animation: `${pulse} 2s infinite`,
                  '&:hover': {
                    animation: 'none',
                  },
                }}
                onClick={() => window.location.href = '/sign-up'}
              >
                Get Started for Free
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Wave divider */}
      <Box sx={{ height: '100px', overflow: 'hidden', transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
          <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#ADEFD1' }}></path>
        </svg>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ my: theme.spacing(10) }}>
          <Typography variant="h3" component="h2" gutterBottom align="center" className="p-4">
            Our Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: theme.spacing(2) }}>
                <AccessTimeIcon color="secondary" sx={{ fontSize: 60, marginBottom: theme.spacing(2) }} />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom align="center">
                    Time management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Manage your tasks and schedules efficiently.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: theme.spacing(2) }}>
                <GroupIcon color="secondary" sx={{ fontSize: 60, marginBottom: theme.spacing(2) }} />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom align="center">
                    Easy collaboration
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Work seamlessly with your teams in real-time.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: theme.spacing(2) }}>
                <SpeedIcon color="secondary" sx={{ fontSize: 60, marginBottom: theme.spacing(2) }} />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom align="center">
                    Agile & Convenient
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Manage your life and work with one single application.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ my: theme.spacing(10) }}>
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Start Your Journey Today
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom align="center" color="text.secondary">
            Join thousands of satisfied users and transform the way you work.
          </Typography>
          <Box component="form" sx={{ mt: theme.spacing(4), display: 'flex', justifyContent: 'center', gap: 2 }}>
            <TextField
              label="Enter your email"
              variant="outlined"
              type="email"
              sx={{ width: 300 }}
            />
            <Button 
              variant="contained" 
              color="secondary" 
              endIcon={<ArrowForwardIcon />}
              sx={{
                animation: `${pulse} 2s infinite`,
                '&:hover': {
                  animation: 'none',
                },
              }}
            >
              Get Started
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: theme.spacing(2) }}>
            By signing up, you agree to our{' '}
            <MuiLink href="#" underline="hover">
              Terms & Conditions
            </MuiLink>
          </Typography>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          py: theme.spacing(6),
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(254,107,139,0.1) 30%, rgba(255,142,83,0.1) 90%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 WorkSpacing. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: theme.spacing(1) }}>
            <MuiLink href="#" underline="hover" sx={{ mx: 1 }}>
              Privacy Policy
            </MuiLink>
            |
            <MuiLink href="#" underline="hover" sx={{ mx: 1 }}>
              Terms of Service
            </MuiLink>
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
