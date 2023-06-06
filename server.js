const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'my_username',
    host: 'localhost', // Use the Docker container name as the host
    database: 'my_database',
    password: 'my_password',
    port: 5432, // Default PostgreSQL port
});

app.post('/liveEvent', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'secret') {
        const event = req.body;
        saveEventToFile(event);
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.get('/userEvents/:userid', (req, res) => {
    const userId = req.params.userid;
    getUserEvents(userId)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error retrieving user events:', error);
            res.sendStatus(500);
        });
});

const saveEventToFile = (event) => {
    const eventString = JSON.stringify(event);
    fs.appendFile('events-server.json', eventString + '\n', (err) => {
        if (err) {
            console.error('Error saving event:', err);
        } else {
            console.log('Event saved to file successfully');
        }
    });
};

const getUserEvents = (userId) => {
    return pool.query('SELECT * FROM users_revenue WHERE user_id = $1', [userId])
        .then(result => {
            return result.rows;
        });
}

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
