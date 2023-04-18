const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { getSecret } = require('../secretMgr/secretMgr');

var client;

async function connectToDatabase() {
    if (client) {
        return client;
    }

    let secret = await getSecret();

    try {
        client = new DynamoDBClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: secret.aws_access_key_id,
                secretAccessKey: secret.aws_secret_access_key,
                sessionToken: secret.aws_session_token
            }
        });

        console.log('Connected to DynamoDb')

        return client;
    } catch (error) {
        console.error(error);
    }
};

module.exports = { connectToDatabase }

