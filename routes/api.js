const express = require('express');
const router = express.Router();
const banks = require('../models/banks.json');
const unirest = require('unirest');
const BASE_URL = 'https://moneywave.herokuapp.com/';

//GET list of banks in KEnya, Nigeria and Ghana
router.post('/banks', (req, res, next) => {
    let url = BASE_URL + 'banks?country=' + req.body.country;

    unirest.post(url)
        .headers({'content-type': 'application/json'})
        .end((response) => {
            res.json({result: response});
            console.log('Bank list fetched and delivered');
        })
});

//Validate Bank Account Numbers
router.post('/account/validate', (req, res, next) => {
    let params = ({
        account_number: req.body.account_number,
        bank_code: req.body.bank_code
    });
    let urlResolve = BASE_URL + 'v1/resolve/account';
    let urlVerify = BASE_URL + 'v1/merchant/verify';
    console.log('params ' + params);
    unirest.post(urlVerify)
        .headers({'content-type': 'application/json'})
        .send({'apiKey': process.env.FW_API_KEY, 'secret': process.env.FW_SECRET})
        .end((response) => {
            let token = response.body.token;
            unirest.post(urlResolve)
                .headers({'content-type': 'application/json', 'authorization': token})
                .send(params)
                .end((response) => {
                    res.json({result: response.body});
                    console.log('Account validation fetched and delivered');
                })
        })
});

//Tokenize Card
router.post('/card/tokenize', (req, res, next) => {
    let params = {
        card_no: req.body.card_no,
        cvv: req.body.cvv,
        expiry_year: req.body.expiry_year, //format 2018
        expiry_month: req.body.expiry_month //format 09
    };
    let urlVerify = BASE_URL + 'v1/merchant/verify';
    let urlTokenize = BASE_URL + 'v1/transfer/charge/tokenize/card';
    unirest.post(urlVerify)
        .headers({'content-type': 'application/json'})
        .send({'apiKey': process.env.FW_API_KEY, 'secret': process.env.FW_SECRET})
        .end((response) => {
            let token = response.body.token;
            unirest.post(urlTokenize)
                .headers({'content-type': 'application/json', 'authorization': token})
                .send(params)
                .end((response) => {
                    res.json({result: response.body});
                    console.log('Card data tokenized');
                })
        })
})

//Card Enquiry
router.post('/card/enquiry', (req, res, next) => {
    let urlVerify = BASE_URL + 'v1/merchant/verify';
    let urlEnquiry = BASE_URL + 'v1/user/card/check';
    let params = { cardNumber: req.body.cardNumber };
    unirest.post(urlVerify)
        .headers({'content-type': 'application/json'})
        .send({'apiKey': process.env.FW_API_KEY, 'secret': process.env.FW_SECRET})
        .end((response) => {
            let token = response.body.token;
            unirest.post(urlEnquiry)
                .headers({'content-type': 'application/json', 'authorization': token})
                .send(params)
                .end((response) => {
                    res.json({result: response.body});
                    console.log('Card enquiry done');
                })
        })
})

module.exports = router;