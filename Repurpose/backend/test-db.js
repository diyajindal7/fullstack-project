const connection = require('./config/db');

// Run a simple query to verify connection
connection.query('SHOW TABLES;', (err, results) => {
    if (err) {
        console.error('Error executing query:', err);
    } else {
        console.log('Tables in database:', results);
    }
    connection.end(); // close the connection
});
