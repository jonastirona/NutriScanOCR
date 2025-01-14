import express from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/uploadController';

// create a new router
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadController = new UploadController();

// define upload routes
router.post('/upload-label', 
    upload.single('image'), 
    uploadController.uploadImage.bind(uploadController)
);

router.get('/parsed-data/:id', 
    uploadController.getParsedData.bind(uploadController)
);

router.post('/validate-data/:id', 
    uploadController.validateData.bind(uploadController)
);

router.get('/health-check', 
    uploadController.healthCheck.bind(uploadController)
);

export default router;