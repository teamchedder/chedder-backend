const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');



const chedder = express();

const users = require('./routes/users');

chedder.use(cors());
chedder.use(bodyParser.json());
chedder.use(passport.initialize());
chedder.use(passport.session());
chedder.use('/users', users);


require('./config/passport')(passport);

chedder.get('/', (req, res) => {
    res.send('Chedder API Endpoint');
})

const port = process.env.PORT || 3000;

chedder.listen(port, () => {
    console.log("Chedder backend service is running on  port ", port);
})