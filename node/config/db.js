const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'gpbyyL9x',
    database: 'Ra3'
});

module.exports = pool.promise();