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

// health check endpoint
describe('POST /api/upload', () => {
    // test to check if the health check endpoint is working
    it('should upload an image and return the image key', async () => {
        const imagePath = path.join(__dirname, 'test_image.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);

        const response = await request(app)
            .post('/api/upload')
            .attach('image', imageBuffer, 'test_image.jpeg');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Image uploaded successfully');
        expect(response.body).toHaveProperty('imageKey');
    });

    // test to check if an error is returned when no image file is provided
    it('should return an error if no image file is provided', async () => {
        const response = await request(app)
            .post('/api/upload');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'No image file provided');
    });
});