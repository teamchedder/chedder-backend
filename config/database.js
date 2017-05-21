require('dotenv').config();

module.exports = {
    database: 'mongodb://127.0.0.1:27017/chedder',
    secret: process.env.DB_SECRET
}