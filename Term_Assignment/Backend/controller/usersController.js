const express = require('express');
const { connectToDatabase } = require('../dynamoDb/conn');
const { DynamoDBClient, PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const AWS = require("aws-sdk");
const sns = new AWS.SNS({ region: 'us-east-1' });
const bcrypt = require('bcrypt');
const path = require('path');
const { getSecret } = require('../secretMgr/secretMgr');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

exports.post_add_user = async (req, res) => {
    try {
        const client = await connectToDatabase();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const dynamoParams = {
            TableName: "users",
            Item: {
                email: { S: req.body.email },
                name: { S: req.body.name },
                password: { S: hashedPassword },
            }
        };

        const command = new PutItemCommand(dynamoParams);
        const dynamoData = await client.send(command);
        if (dynamoData) {
            const subscribeResponse = await subscribeEmail(req.body.email);
            if (subscribeResponse) {
                return res.status(200).json({
                    'message': 'User added successfully'
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            'message': 'Internal server error'
        });
    }
};

exports.get_check_email = async (req, res) => {
    try {
        const client = await connectToDatabase();

        const findNameParams = {
            TableName: "users",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": { S: req.params.email }
            }
        };

        const findNameCommand = new ScanCommand(findNameParams);
        let findNameData = await client.send(findNameCommand);
        if (findNameData.Items.length > 0) {
            return res.status(200).json({
                'message': 'Email ID found'
            });
        } else {
            return res.status(400).json({
                'message': 'No email exists'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            'message': 'Internal server error'
        });
    }
};

exports.post_validateUser = async (req, res) => {
    try {
        const client = await connectToDatabase();

        const findPassParams = {
            TableName: "users",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": { S: req.body.email }
            }
        };

        const findPassCommand = new ScanCommand(findPassParams);
        let findNameData = await client.send(findPassCommand);
        if (findNameData.Items.length > 0) {
            findNameData = AWS.DynamoDB.Converter.unmarshall(findNameData.Items[0]);
            bcrypt.compare(req.body.password, findNameData.password).then(isMatch => {
                if (isMatch) {
                    return res.status(200).json({
                        'message': 'Authentication successful'
                    });
                } else {
                    return res.status(400).json({
                        'message': 'Authentication failed'
                    });
                }
            });
        } else {
            return res.status(404).json({
                'message': 'Authentication failed'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "Internal Server Error"
        });
    }
};


async function subscribeEmail(email) {
    try {
        let secret = await getSecret();
        const params = {
            Protocol: 'email',
            TopicArn: secret.snsTopicArn,
            Endpoint: email,
        };

        await sns.subscribe(params).promise();
        return { message: `Subscribed ${email} to SNS topic successfully` };
    } catch (error) {
        console.log(error);
    }
};