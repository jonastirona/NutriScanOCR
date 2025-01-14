import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';

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

            const parsedData = await this.imageService.uploadImage(
                req.file.buffer,
                req.file.originalname
            );

            res.status(200).json({
                message: 'Image uploaded and text extracted successfully',
                data: parsedData
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload image and extract text' });
        }
    }
}