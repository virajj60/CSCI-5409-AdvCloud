require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const amazonS3Uri = require('amazon-s3-uri');

var express = require('express');
var app = express();
var axios = require('axios');
const { fileURLToPath } = require('url');

const s3 = new AWS.S3({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token
});

app.use(express.json());


app.post('/storedata', async function (request, response) {
    const content = request.body.data;

    const params = {
        Bucket: '<bucketname>',
        Key: 'file.txt',
        ACL: 'public-read',
        Body: content
    };

    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        return response.status(200).send({
            "s3uri": data.Location
        });
    });

});

app.post('/appenddata', async function (request, response) {
    const content = request.body.data;

    const params = {
        Bucket: '<bucketname>',
        Key: 'file.txt',
    };

    s3.getObject(params, function (err, data) {
        if (err) {
            throw err;
        }
        else {
            const newData = (data.Body.toString()).concat(content.toString());

            const params = {
                Bucket: '<bucketname>',
                Key: 'file.txt',
                ACL: 'public-read',
                Body: newData
            };

            s3.upload(params, function (err, data) {
                if (err) {
                    throw err;
                }
                return response.sendStatus(200);
            });
        }
    });
});


app.post('/deletefile', async function (request, response) {
    const uri = request.body.s3uri; 
    const {region,bucket,key} = amazonS3Uri(uri);

    const params = {
        Bucket: bucket,
        Key: key,
    };

    s3.deleteObject(params, function (err,data){
        if(err){
            throw err;
        }
        return response.sendStatus(200);
    });
 
});

app.listen(3000);
