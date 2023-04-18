const AWS = require("aws-sdk");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function getSecret() {
    const secret_name = process.env.secret_name;
    const client = new SecretsManagerClient({ region: "us-east-1" });
    let response = await client.send(
        new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT",
        })
    );
    let secret = response.SecretString;
    secret = await JSON.parse(secret);
    return secret;
};

module.exports = { getSecret }