import request from 'supertest';
import express from 'express';
import uploadRoutes from '../src/routes/uploadRoutes';
import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', uploadRoutes);

// test the POST /api/upload-label route
describe('POST /api/upload-label', () => {
    it('should upload an image and return the parsed data with an ID', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const response = await request(app)
            .post('/api/upload-label')
            .attach('image', imageBuffer, 'test_image.jpeg');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Image uploaded and text extracted successfully');
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('data');
    });

    it('should return an error if no image file is provided', async () => {
        const response = await request(app)
            .post('/api/upload-label');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'No image file provided');
    });
});

// test the GET /api/parsed-data/:id route
describe('GET /api/parsed-data/:id', () => {
    it('should return parsed data for a valid ID', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const uploadResponse = await request(app)
            .post('/api/upload-label')
            .attach('image', imageBuffer, 'test_image.jpeg');

        const { id } = uploadResponse.body;

        const response = await request(app)
            .get(`/api/parsed-data/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });

    it('should return an error for an invalid ID', async () => {
        const response = await request(app)
            .get('/api/parsed-data/invalid-id');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Data not found');
    });
});

// test the POST /api/validate-data/:id route
describe('POST /api/validate-data/:id', () => {
    it('should update parsed data for a valid ID', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const uploadResponse = await request(app)
            .post('/api/upload-label')
            .attach('image', imageBuffer, 'test_image.jpeg');

        const { id } = uploadResponse.body;

        const updates = { calories: '200' };

        const response = await request(app)
            .post(`/api/validate-data/${id}`)
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Data updated successfully');
        expect(response.body.data).toHaveProperty('calories', '200');
    });

    it('should return an error for an invalid ID', async () => {
        const updates = { calories: '200' };

        const response = await request(app)
            .post('/api/validate-data/invalid-id')
            .send(updates);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Data not found');
    });

    it('should return an error for invalid data types', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const uploadResponse = await request(app)
            .post('/api/upload-label')
            .attach('image', imageBuffer, 'test_image.jpeg');

        const { id } = uploadResponse.body;

        const updates = { calories: 'invalid' };

        const response = await request(app)
            .post(`/api/validate-data/${id}`)
            .send(updates);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid data type for calories');
    });

    it('should return an error for missing required fields', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const uploadResponse = await request(app)
            .post('/api/upload-label')
            .attach('image', imageBuffer, 'test_image.jpeg');

        const { id } = uploadResponse.body;

        const updates = {};

        const response = await request(app)
            .post(`/api/validate-data/${id}`)
            .send(updates);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required fields');
    });

    it('should handle boundary values for numerical inputs', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const uploadResponse = await request(app)
            .post('/api/upload-label')
            .attach('image', imageBuffer, 'test_image.jpeg');

        const { id } = uploadResponse.body;

        const updates = { calories: '0' };

        const response = await request(app)
            .post(`/api/validate-data/${id}`)
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('calories', '0');
    });

    it('should return an error for large payloads', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const uploadResponse = await request(app)
            .post('/api/upload-label')
            .attach('image', imageBuffer, 'test_image.jpeg');

        const { id } = uploadResponse.body;

        const updates = { calories: '200'.repeat(10000) };

        const response = await request(app)
            .post(`/api/validate-data/${id}`)
            .send(updates);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid boundary value for calories. It should be in between 0 and 100000.');
    });
});

// test the GET /api/health-check route
describe('GET /api/health-check', () => {
    it('should return API health status', async () => {
        const response = await request(app)
            .get('/api/health-check');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'API is healthy');
    });
});

// test invalid endpoints
describe('Invalid endpoints', () => {
    it('should return an error for invalid endpoints', async () => {
        const response = await request(app)
            .get('/api/invalid-endpoint');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
});