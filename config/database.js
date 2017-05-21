require('dotenv').config();

module.exports = {
    database: 'mongodb://localhost:27017/chedder',
    secret: process.env.DB_SECRET
}