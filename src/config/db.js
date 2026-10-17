const mysqlcnn = require('mysql2/promise');
require('dotenv').config();

const pool = mysqlcnn.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Conexion exitosa');
        connection.release();
    })
    .catch(err => {
        console.log('Error de conexion')
    });

module.exports = pool;