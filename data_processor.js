const fs = require('fs');
const { Pool } = require('pg');

// PostgreSQL connection pool configuration
const pool = new Pool({
    user: 'my_username',
    host: 'localhost', // Use the Docker container name as the host
    database: 'my_database',
    password: 'my_password',
    port: 5432, // Default PostgreSQL port
});

// Read and process events from a file
const processEventsFromFile = (filename) => {
    const fileStream = fs.createReadStream(filename);
    const events = [];

    fileStream.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach((line) => {
            if (line.trim() !== '') {
                const event = JSON.parse(line);
                events.push(event);
            }
        });
    });

    fileStream.on('end', () => {
        processEvents(events);
    });
};

// Calculate the user's revenue and update the database
const processEvents = (events) => {
    const userRevenueMap = new Map();

    events.forEach((event) => {
        const { userId, name, value } = event;

        if (!userRevenueMap.has(userId)) {
            userRevenueMap.set(userId, 0);
        }

        const revenue = name === 'add_revenue' ? value : -value;
        const currentRevenue = userRevenueMap.get(userId);
        userRevenueMap.set(userId, currentRevenue + revenue);
    });

    userRevenueMap.forEach((revenue, userId) => {
        updateRevenueInDatabase(userId, revenue);
    });
};

// Update the user's revenue in the database using upsert (insert or update)
const updateRevenueInDatabase = (userId, revenue) => {
    const query = `
    INSERT INTO users_revenue (user_id, revenue)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET revenue = users_revenue.revenue + $2
  `;

    pool.query(query, [userId, revenue])
        .catch((error) => {
            console.error('Error updating user revenue:', error);
        });
};

// Get the command-line arguments
const args = process.argv.slice(2);

// Check if a filename argument was provided
if (args.length !== 1) {
    console.error('Please provide a single event file name as a command-line argument');
    process.exit(1);
}

// Retrieve the event file name from the command-line argument
const eventFile = args[0];

// Process the event file
processEventsFromFile(eventFile);

