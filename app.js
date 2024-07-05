const express = require('express');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/team', async (req, res) => {
    const teamName = req.body.team;
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/teams',
        params: { search: teamName },
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY
        }
    };

    try {
        const response = await axios.request(options);
        console.log('API Response:', response.data); 
        if (response.data && response.data.response && response.data.response.length > 0) {
            const teamData = response.data.response[0];
            res.json(teamData);
        } else {
            console.log('No team found with that name.');
            res.json({ error: 'No team found with that name.' });
        }
    } catch (error) {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        res.json({ error: 'Unable to fetch team data. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




