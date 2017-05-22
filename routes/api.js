const express = require('express');
const router = express.Router();
const banks = require('../models/banks.json');

//GET list of banks in KEnya, Nigeria and Ghana
router.get('/banks', (req, res, next) => {
    switch(req.query.country){
        case "NG":
            res.json({ result: banks.NG });
            break;
        case "KE":
            res.json({ result: banks.KE });
            break;
        case "GH":
            res.json({ result: banks.GH });
            break;
        default:
            res.json({ result: 'Country not found' });
            
    }
});

//Validate Bank Account Numbers
router.post('/account/resolve', (req, res, next) => {
    let params = {
        account_number: req.body.account_number,
        bank_code: req.body.bank_code
    }
})

module.exports = router;