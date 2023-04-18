const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' });

exports.handler = async (event) => {

    let queueURL;

    if (event.type === 'CONNECT') {
        queueURL = '<CONNECT_QUEUE_URL>';
    } else if (event.type === 'SUBSCRIBE') {
        queueURL = '<SUBSCRIBE_QUEUE_URL>';
    } else if (event.type === 'PUBLISH') {
        queueURL = '<PUBLISH_QUEUE_URL>';
    } else {
        console.error('Invalid type');
    }

    const receiveParams = {
        QueueUrl: queueURL,
        MaxNumberOfMessages: 1, // receive up to 10 messages at a time
        WaitTimeSeconds: 20
    };

    const promiseData = await sqs.receiveMessage(receiveParams).promise();
    const resultData = await promiseData;
    const JSONresultData = JSON.parse(resultData.Messages[0].Body);

    console.log(resultData.Messages[0]);


    if (resultData.Messages.length > 0) {
        if (event.type === 'CONNECT') {
            const response = {
                type: 'CONNACK',
                returnCode: 0,
                username: JSONresultData.username,
                password: JSONresultData.password
            };

            const deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: resultData.Messages[0].ReceiptHandle
            };

            await sqs.deleteMessage(deleteParams).promise();
            console.log(response);
            return response;

        } else if (event.type === 'SUBSCRIBE') {
            const response = {
                'type': 'SUBACK',
                'returnCode': 0
            };

            const deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: resultData.Messages[0].ReceiptHandle
            };

            await sqs.deleteMessage(deleteParams).promise();
            console.log(response);
            return response;

        } else if (event.type === 'PUBLISH') {
            const response = {
                type: 'PUBACK',
                returnCode: 0,
                payload: JSONresultData.payload
            };

            const deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: resultData.Messages[0].ReceiptHandle
            };

            await sqs.deleteMessage(deleteParams).promise();
            console.log(response);
            return response;
        }
    }
};