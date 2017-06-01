const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const unirest = require('unirest');

mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const chedder = express();

const users = require('./routes/users');
const api = require('./routes/api');

chedder.use(cors());
chedder.use(bodyParser.json());
chedder.use(passport.initialize());
chedder.use(passport.session());
chedder.use('/users', users);
chedder.use('/api', api);


require('./config/passport')(passport);

chedder.get('/', (req, res) => {
    res.send('Chedder API Endpoint');
});

const port = process.env.PORT || 8080;

chedder.listen(port, () => {
    console.log("Chedder backend service is running on  port ", port);
})