require('dotenv').config();
const mysql = require('mysql2/promise');

class DbConnection {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'amalgam',
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    static getInstance() {
        if (!DbConnection.instance) {
            DbConnection.instance = new DbConnection();
            console.log('Database connection established');
        }
        return DbConnection.instance;
    }

    async query(sql, params) {
        try {
            const [results] = await this.pool.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
}

// Usage;
/* 

const db = DbConnection.getInstance();

w/o params
const users = await db.query('SELECT * FROM users');

w/ params
const userId = 1;
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

const newUser = await db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    ['Alice', 'alice@example.com']
);

*/

module.exports = DbConnection;