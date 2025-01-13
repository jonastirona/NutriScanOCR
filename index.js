const AWS = require('aws-sdk');
const textract = new AWS.Textract();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const bucket = event.Records[0].s3.bucket.name;
        const key = event.Records[0].s3.object.key;
        
        // Get the image from S3
        const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        
        // Process with Textract
        const params = {
            Document: {
                Bytes: image.Body
            }
        };
        
        const textractResult = await textract.detectText(params).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify(textractResult)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process image' })
        };
    }
};