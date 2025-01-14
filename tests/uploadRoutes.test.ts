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

// Test the POST /api/upload route
describe('POST /api/upload', () => {
    // test to upload an image and extract text
    it('should upload an image and return the parsed data', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const response = await request(app)
            .post('/api/upload')
            .attach('image', imageBuffer, 'test_image.jpeg');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Image uploaded and text extracted successfully');
        expect(response.body).toHaveProperty('data');

        // log parsed data
        console.log('Parsed Data:', response.body.data);

        // update the assertion to check for known fields in the parsed data
        expect(response.body.data).toHaveProperty('calories');
        expect(response.body.data).toHaveProperty('totalFat');
    });

    // test to return an error if no image file is provided
    it('should return an error if no image file is provided', async () => {
        const response = await request(app)
            .post('/api/upload');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'No image file provided');
    });
});