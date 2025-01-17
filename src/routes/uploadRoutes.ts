import express from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/uploadController';

// create a new router
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const uploadController = new UploadController();

// middleware to log request size
const logRequestSize = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const contentLength = req.headers['content-length'];
    console.log(`Request size: ${contentLength} bytes`);
    next();
};

// define upload routes
router.post('/upload-label', 
    logRequestSize,
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