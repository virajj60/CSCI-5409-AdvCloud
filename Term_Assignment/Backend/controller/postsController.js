const express = require('express');
const { connectToDatabase } = require('../dynamoDb/conn');
const { DynamoDBClient, PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { getSecret } = require('../secretMgr/secretMgr');


exports.post_add_post = async (req, res) => {
    try {

        let secret = await getSecret();
        const key = uuidv4();
        const postID = uuidv4();

        const s3 = new AWS.S3({
            accessKeyId: secret.aws_access_key_id,
            secretAccessKey: secret.aws_secret_access_key,
            sessionToken: secret.aws_session_token
        });

        if (req.file) {
            const S3params = {
                Bucket: process.env.s3_bucket_name,
                Key: key,
                Body: req.file.buffer,
                ACL: 'public-read',
                ContentType: req.file.mimetype
            }
            const uploadPromise = await s3.upload(S3params).promise();
            const S3data = uploadPromise;
            if (S3data) {
                console.log(S3data.Location);
            }
        }

        const client = await connectToDatabase();

        const requestBody = { ...req.body };
        const findNameParams = {
            TableName: "users",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": { S: requestBody.owner_email }
            }
        };

        let name;
        const findNameCommand = new ScanCommand(findNameParams);
        let findNameData = await client.send(findNameCommand);

        if (findNameData.Items.length > 0) {
            findNameData = await findNameData.Items.map(item => {
                name = AWS.DynamoDB.Converter.unmarshall(item).name;
            });

            const dynamoParams = {
                TableName: "posts",
                Item: {
                    owner_email: { S: requestBody.owner_email },
                    name: { S: name },
                    item_desc: { S: requestBody.item_desc },
                    qty: { N: requestBody.qty },
                    price: { N: requestBody.price },
                    address: { S: requestBody.address },
                    img_url: { S: key.toString() },
                    post_id: { S: postID.toString() }
                }
            };

            const command = new PutItemCommand(dynamoParams);
            const dynamoData = await client.send(command);
            console.log(dynamoData);
            if (dynamoData) {
                console.log('Inside Before Email');
                const emailSent = publishEmail();
                if (emailSent) {
                    return res.status(200).json({
                        'message': 'Post added successfully'
                    });

                }
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            'message': 'Internal server error'
        })
    }
};

exports.get_all_posts = async (req, res) => {
    try {
        const client = await connectToDatabase();

        const params = {
            "TableName": "posts"
        };
        const command = new ScanCommand(params);
        let data = await client.send(command);

        if (data.Items.length > 0) {
            data = data.Items.map(item => {
                return AWS.DynamoDB.Converter.unmarshall(item);
            });
            return res.status(200).send(data);
        } else {
            return res.status(404);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            'message': 'Internal server error'
        })
    }
};

exports.get_post_details = async (req, res) => {
    try {
        const client = await connectToDatabase();

        const findPostDetParams = {
            TableName: "posts",
            FilterExpression: "post_id = :post_id",
            ExpressionAttributeValues: {
                ":post_id": { S: req.params.post_id }
            }
        };

        const findPostDetCommand = new ScanCommand(findPostDetParams);
        let findPostDet = await client.send(findPostDetCommand);

        if (findPostDet.Items.length > 0) {
            findPostDet = AWS.DynamoDB.Converter.unmarshall(findPostDet.Items[0]);
            return res.status(200).send(findPostDet);
        } else {
            return res.status(404).json({
                'message': 'No details fetched'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            'message': 'Internal server error'
        })
    }
};


async function publishEmail() {
    try {

        let secret = await getSecret();

        const sns = new AWS.SNS({ region: 'us-east-1' });

        console.log(secret.snsTopicArn);

        let params = {
            Message: 'A new post is available on Yardsale',
            Subject: 'Yardsale| New Listing Alert',
            TopicArn: secret.snsTopicArn
        };

        sns.publish(params, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
                return { 'message': 'Email Sent' };
            }
        });
    } catch (error) {
        console.error(error);
    }
};