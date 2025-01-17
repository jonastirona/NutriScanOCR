import express from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/uploadController';

// create a new router
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
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
    express.json({ limit: '1mb' }),
    uploadController.validateData.bind(uploadController)
);

router.get('/health-check',
    uploadController.healthCheck.bind(uploadController)
);

// handle invalid endpoints
router.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

export default router;