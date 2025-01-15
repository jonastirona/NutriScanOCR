const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Health check endpoint
app.get('/health-check', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Create server
const server = awsServerlessExpress.createServer(app);

// Lambda handler
exports.handler = (event, context, callback) => {
    awsServerlessExpress.proxy(server, event, {
        succeed: (response) => {
            callback(null, {
                statusCode: response.statusCode,
                body: JSON.stringify(response.body),
                headers: response.headers,
                isBase64Encoded: false
            });
        },
        fail: (error) => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Internal server error',
                    message: error.message
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                isBase64Encoded: false
            });
        }
    });
};