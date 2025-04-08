require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const vinylRecordsEndpoint = 'https://api.hubapi.com/crm/v3/objects/2-141294286';

// ROUTE 1 - Homepage to display all vinyl records
app.get('/', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(`${vinylRecordsEndpoint}?properties=name,artist,release_year,genre,condition,id`, { headers });
        
        const data = resp.data.results;
        
        res.render('homepage', { 
            title: 'Vintage Vinyl Records | Integrating With HubSpot I Practicum', 
            data 
        });      
    } catch (error) {
        res.status(500).send('Error fetching vinyl records data');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    // Création de l'objet avec les données du formulaire
    const newRecord = {
        properties: {
            name: req.body.name,
            artist: req.body.artist,
            release_year: req.body.release_year,
            genre: req.body.genre,
            condition: req.body.condition,
            id: req.body.id
        }
    };
    
    try {
        await axios.post(vinylRecordsEndpoint, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error creating new vinyl record');
    }
});



// * Localhost
app.listen(5000, () => console.log('Listening on http://localhost:5000'));