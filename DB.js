const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.host || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.user ,
    password: process.env.password ,
    database: process.env.database ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connect to MySQL
// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err.stack);
//         return;
//     }
//     console.log('Connected to MySQL database.');
// });


module.exports = {db}