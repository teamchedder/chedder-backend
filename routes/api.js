const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const BASE_URL = 'https://moneywave.herokuapp.com/';

//GET list of banks in KEnya, Nigeria and Ghana
router.post('/banks', (req, res, next) => {
    let countryCode;
    let country = req.body.country;
    switch(country){
        case "Nigeria":
            countryCode = "NG";
            break;
        case "Ghana":
            countryCode = "GH";
            break;
        case "Kenya":
            countryCode = "KE";
            break;
        default:
            countryCode = "None";
    }
    let url = BASE_URL + 'banks?country=' + countryCode;

    unirest.post(url)
        .headers({'content-type': 'application/json'})
        .end((response) => {
            let result = response.body.data
            res.json({result: response.body});
            console.log('Bank list fetched and delivered');
        })
});

//Validate Bank Account Numbers
router.post('/account/validate', (req, res, next) => {
    ///* Live FW Resolution
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


//Transfer from Card to Account
router.post('/transfer/cardaccount', (req, res, next) => {
    let urlVerify = BASE_URL + 'v1/merchant/verify';
    let urlTransfer = BASE_URL + 'v1/transfer';
    let params = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        phonenumber: req.body.phoneNumber,
        recipient_bank: req.body.recipientBank,
        recipient_account_number: req.body.recipientAccountNumber,
        card_no: req.body.cardNumber,
        cvv: req.body.cvv,
        pin: req.body.pinVerve,
        expiry_year: req.body.expiryYear,
        expiry_month: req.body.expiryMonth,
        charge_auth: req.body.pinMastercard,
        apiKey: process.env.FW_API_KEY,
        amount: req.body.totalAmount,
        narration: req.body.description,
        fee: req.body.chargeAmount,
        medium: 'web',
        redirectUrl: ''
    };
    unirest.post(urlVerify)
        .headers({'content-type': 'application/json'})
        .send({'apiKey': process.env.FW_API_KEY, 'secret': process.env.FW_SECRET})
        .end((response) => {
            let token = response.body.token;
            unirest.post(urlTransfer)
                .headers({'content-type': 'application/json', 'authorization': token})
                .send(params)
                .end((response) => {
                    res.json({result: response.body});
                    console.log('Card to account transfer done');
                })
        })
});

//Transfer from tokenized Card to Account
//still having issues requiring PIN. To reply FW with errors.
router.post('/transfer/tokenizedcardaccount', (req, res, next) => {
    let urlVerify = BASE_URL + 'v1/merchant/verify';
    let urlTransfer = BASE_URL + 'v1/transfer';
    let params = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        phonenumber: req.body.phoneNumber,
        recipient_bank: req.body.recipientBank,
        recipient_account_number: req.body.recipientAccountNumber,
        apiKey: process.env.FW_API_KEY,
        amount: req.body.totalAmount,
        charge_with: "tokenized_card",
        pin: req.body.pinVerve,
        card_token: process.env.TEST_CARD_TOKEN,
        fee: req.body.chargeAmount,
        medium: 'web',
        redirectUrl: 'https://moneywave-api-integrations.herokuapp.com'
    };
    unirest.post(urlVerify)
        .headers({'content-type': 'application/json'})
        .send({'apiKey': process.env.FW_API_KEY, 'secret': process.env.FW_SECRET})
        .end((response) => {
            let token = response.body.token;
            unirest.post(urlTransfer)
                .headers({'content-type': 'application/json', 'authorization': token})
                .send(params)
                .end((response) => {
                    res.json({result: response.body});
                    console.log('Tokenized Card to account transfer done');
                })
        })
});

//Transfer from Account to aAccount
router.post('/transfer/accountaccount', (req, res, next) => {
    let urlVerify = BASE_URL + 'v1/merchant/verify';
    let urlTransfer = BASE_URL + 'v1/transfer';
    let params = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        recipient_bank: req.body.recipient_bank,
        recipient_account_number: req.body.recipient_account_number,
        charge_with: "account",
        recipient: "account",
        sender_account_number: req.body.sender_account_number,
        sender_bank: req.body.sender_bank,
        apiKey: process.env.FW_API_KEY,
        amount: req.body.amount,
        narration: req.body.narration,
        fee: 45,
        medium: 'web',
        redirectUrl: "https://google.com"
    }

    unirest.post(urlVerify)
        .headers({'content-type': 'application/json'})
        .send({'apiKey': process.env.FW_API_KEY, 'secret': process.env.FW_SECRET})
        .end((response) => {
            let token = response.body.token;
            unirest.post(urlTransfer)
                .headers({'content-type': 'application/json', 'authorization': token})
                .send(params)
                .end((response) => {
                    res.json({result: response.body});
                    console.log('Account to account transfer done');
                })
        })
})

module.exports = router;