import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DescriptionIcon from '@mui/icons-material/Description'; // Import for file icon
import ShareIcon from '@mui/icons-material/Share'; // Import for share icon
import '../assets/css/Home.css'; // Ensure this path is correct

const Home = () => {
    const navigate = useNavigate();

    const handleRedirect = (event) => {
        if (event.target === event.currentTarget) {
            return; // Prevent navigation on empty space click
        }
        navigate('/MyList'); // Navigate to the MyList page
    };

    return (
        <div className="home-container" onClick={handleRedirect}>
            <Box className="icon-container">
                <FlightTakeoffIcon className="flight-icon" />
                <Typography variant="h6" className="travel-text">
                    Travel Request
                </Typography>
            </Box>
            <Box className="icon-container">
                <DescriptionIcon className="flight-icon" />
                <Typography variant="h6" className="travel-text">
                    Eclaim
                </Typography>
            </Box>
            <Box className="icon-container">
                <ShareIcon className="flight-icon" />
                <Typography variant="h6" className="travel-text">
                    CNDN
                </Typography>
            </Box>
        </div>
    );
};

export default Home;
