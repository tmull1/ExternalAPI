const express = require('express'); // Import Express framework
const axios = require('axios'); // Import Axios for making HTTP requests
const path = require('path'); // Import Path module for handling file paths
const dotenv = require('dotenv'); // Import dotenv for managing environment variables
const cors = require('cors'); // Import CORS for handling cross-origin requests

dotenv.config(); // Load environment variables from a .env file

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000; // Set the port number from environment variables or default to 3000

// CORS options to allow all origins
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (for form submissions)
app.use(express.json()); // Parse JSON bodies (for API requests)

// POST endpoint to search for a team by name
app.post('/team', async (req, res) => {
    const teamName = req.body.team; // Get the team name from the request body
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/teams', // API endpoint to search for teams
        params: { search: teamName }, // Query parameter with the team name
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com', // RapidAPI host header
            'x-rapidapi-key': process.env.RAPIDAPI_KEY // RapidAPI key from environment variables
        }
    };

    try {
        const response = await axios.request(options); // Make the API request using Axios
        console.log('API Response:', response.data); // Log the API response data
        if (response.data && response.data.response && response.data.response.length > 0) {
            const teamData = response.data.response[0]; // Get the first team from the response
            res.json(teamData); // Send the team data as JSON response
        } else {
            console.log('No team found with that name.');
            res.json({ error: 'No team found with that name.' }); // Send an error message if no team is found
        }
    } catch (error) {
        if (error.response) {
            // Log detailed error response information
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request:', error.request); // Log the error request if no response was received
        } else {
            console.error('Error message:', error.message); // Log any other errors
        }
        res.json({ error: 'Unable to fetch team data. Please try again.' }); // Send a generic error message
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




