const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

// Read events from the "events.jsonl" file
const readEventsFromFile = async () => {
    const fileStream = fs.createReadStream('events.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const event = JSON.parse(line);
        await sendEventToServer(event);
    }
};

// Send an event to the server's '/liveEvent' endpoint
const sendEventToServer = async (event) => {
    try {
        const response = await axios.post('http://localhost:8000/liveEvent', event, {
            headers: {
                Authorization: 'secret',
            },
        });
        console.log('Event saved successfully', response.status);
    } catch (error) {
        console.error('Error saving event:', error.response?.data, error.response);
    }
};

// Start reading events from the file and sending them to the server
readEventsFromFile();
