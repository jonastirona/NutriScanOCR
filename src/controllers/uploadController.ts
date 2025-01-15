import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';

// in-memory store for parsed data
const parsedDataStore: Record<string, Record<string, string>> = {};

// controller class to handle image uploads
export class UploadController {
    private imageService: ImageService;

    constructor() {
        this.imageService = new ImageService();
    }

    // method to upload an image and extract text
    async uploadImage(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No image file provided' });
                return;
            }

            const uniqueId = Date.now().toString(); // generate a unique ID
            const parsedData = await this.imageService.uploadImage(
                req.file.buffer,
                req.file.originalname
            );

            parsedDataStore[uniqueId] = parsedData;

            res.status(200).json({
                message: 'Image uploaded and text extracted successfully',
                id: uniqueId,
                data: parsedData
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload image and extract text' });
        }
    }

    // method to get parsed data by ID
    getParsedData(req: Request, res: Response): void {
        const { id } = req.params;
        const data = parsedDataStore[id];

        if (!data) {
            res.status(404).json({ error: 'Data not found' });
            return;
        }

        res.status(200).json({ data });
    }

    // method to validate and update parsed data by ID
    validateData(req: Request, res: Response): void {
        const { id } = req.params;
        const updates = req.body;
    
        if (!parsedDataStore[id]) {
            res.status(404).json({ error: 'Data not found' });
            return;
        }
    
        // Check for missing required fields
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
    
        // Validate updates
        for (const [key, value] of Object.entries(updates)) {
            if (typeof value !== 'string' || isNaN(Number(value))) {
                res.status(400).json({ error: `Invalid data type for ${key}` });
                return;
            }
            if (Number(value) < 0 || Number(value) > 100000) {
                res.status(400).json({ error: `Invalid boundary value for ${key}. It should be in between 0 and 100000.` });
                return;
            }
        }
    
        parsedDataStore[id] = { ...parsedDataStore[id], ...updates };
    
        res.status(200).json({ message: 'Data updated successfully', data: parsedDataStore[id] });
    }

    // method for health check
    healthCheck(req: Request, res: Response): void {
        res.status(200).json({ status: 'API is healthy' });
    }
}