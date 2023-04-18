var express = require('express');
var axios = require('axios');
var fs = require('fs');
var app = express();
const NodeRSA = require('node-rsa');
const { Console } = require('console');

app.use(express.json());

app.post('/decrypt', async function (request, response) {
    const encryptedString = request.body.message;
    if (encryptedString) {
        try {
            const privateKey = fs.readFileSync('private_key.txt', 'utf-8');
            const buffer = Buffer.from(encryptedString, 'base64');
            const key = new NodeRSA(privateKey);
            const decryptedMessage = key.decrypt(buffer);
            return response.status(200).send(
                {
                    "response": decryptedMessage.toString()
                }
            );

        } catch (err) {
            console.error(err);
        }
    }
});

app.post('/encrypt', async function (request, response) {
    const message = request.body.message;
    if (message) {
        try {
            const publicKey = fs.readFileSync('public_key.txt', 'utf-8');
            const key = new NodeRSA(publicKey);
            const encryptedMessage = key.encrypt(message);
            return response.status(200).send(
                {
                    "response": encryptedMessage.toString("base64")
                }
            );
        } catch (err) {
            console.error(err);
        }
    }
});

app.listen(3000);