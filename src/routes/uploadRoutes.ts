import express from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/uploadController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadController = new UploadController();

router.post('/upload', 
    upload.single('image'), 
    uploadController.uploadImage.bind(uploadController)
);

export default router;