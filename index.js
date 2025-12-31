const express = require('express');
const axios = require('axios');
// Load environment variables from .env (PRIVATE_APP_ACCESS)
require('dotenv').config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS || '';
// HubSpot custom object endpoint derived from your developer account URL
// For the provided URL: https://app.hubspot.com/contacts/50861169/objects/2-55323801/views/all/list
// the object type is `2-55323801` — use that in the API endpoint below.
const CUSTOM_OBJECT_ENDPOINT = 'https://api.hubapi.com/crm/v3/objects/2-55323801';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// Route: GET / - homepage (renders a simple contacts view)
// Route: GET / - fetch custom object records and render the homepage
app.get('/', async (req, res) => {
    if (!PRIVATE_APP_ACCESS) {
        console.warn('PRIVATE_APP_ACCESS not set; rendering homepage with empty data.');
        return res.render('homepage', { title: 'Home | Integrating With HubSpot I Practicum', data: [] });
    }

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Request the specific custom properties created in the practicum
        const resp = await axios.get(CUSTOM_OBJECT_ENDPOINT, {
            headers,
            params: {
                limit: 100,
                properties: 'name,bio,species'
            }
        });
        const data = resp.data && resp.data.results ? resp.data.results : [];
        res.render('homepage', { title: 'Home | Integrating With HubSpot I Practicum', data });
    } catch (err) {
        console.error('Error fetching custom objects from HubSpot:', err?.response?.data || err.message || err);
        res.render('homepage', { title: 'Home | Integrating With HubSpot I Practicum', data: [] });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// Route: GET /updates - render the updates form
app.get('/updates', (req, res) => {
    res.render('updates', { title: 'Udpate Custom Object Form | Integrating With Hubspot I Practicum' });
});

// Route: GET /update-cobj - render the form to create/update a custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Udpate Custom Object Form | Integrating With Hubspot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

// Route: POST /update-cobj - receive form data and (placeholder) send to HubSpot
app.post('/update-cobj', async (req, res) => {
    const { name, bio, category } = req.body;
    console.log('Received custom object data:', { name, bio, category });
    if (!PRIVATE_APP_ACCESS) {
        console.warn('PRIVATE_APP_ACCESS is not set. Skipping HubSpot API call.');
        return res.redirect('/');
    }

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const payload = {
        properties: {
            name: name || '',
            bio: bio || '',
            // accept either species (if the form uses it) or category and map to species for the API
            species: (req.body.species || category) || ''
        }
    };

    try {
        await axios.post(CUSTOM_OBJECT_ENDPOINT, payload, { headers });
    } catch (err) {
        console.error('Error creating custom object in HubSpot:', err?.response?.data || err.message || err);
    }

    // Redirect to the homepage after attempting creation
    res.redirect('/');
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));