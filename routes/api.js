const express = require('express');
const router = express.Router();
const banks = require('../models/banks.json');
const unirest = require('unirest');
const BASE_URL = 'https://moneywave.herokuapp.com/';

//GET list of banks in KEnya, Nigeria and Ghana
router.get('/banks', (req, res, next) => {
    /* FW Live retrieve bak acounts
    let url = BASE_URL + 'banks?country=' + req.query.country;

    unirest.post(url)
        .headers({'content-type': 'application/json'})
        .end((response) => {
            res.json({result: response});
            console.log('Bank list fetched and delivered');
        })
    */
    // Mock data from JSON file
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
    };
    /* FW Live account resolution
    let url = BASE_URL + 'v1/resolve/account';
    let token = authenticateFW();
    unirest.post(url)
        .headers({'content-type': 'application/json', 'authorization': token})
        .send(params)
        .end((response) => {
            res.json({result: response.body});
            console.log('Account validation fetched and delivered');
        })
    */
    let mockAccountHolders = ["Emmanuela Kyeta", "Francis Ngugi", "Felix Wathira", "Nguli Masheti", "Nareti Wambugu", "Kelechi Obi", "Mary Otu", "Haruna Adebayo", "Simeon Olugbenga", "Imaobong Eyo", "Sarah Agbanu", "Kwame Bimpong", "Jason Smith", "Nana Boateng", "Amma Boachye"]
    res.json({result: {
    "status": "success",
    "data": {
          "account_name": mockAccountHolders[Math.floor(Math.random() * mockAccountHolders.length)]
    }
}})
})

function authenticateFW(){
    /* FW Live authentication
    let url = BASE_URL + 'v1/merchant/verify';
    unirest.post(url)
        .headers({'content-type': 'application/json'})
        .send({'apiKey': process.env.FW_API_KEY, 'secret': process.env.FW_SECRET})
        .end((response) => {
            return response.body.token;
        })
    */
    return process.env.AUTH_TOKEN;
}

module.exports = router;