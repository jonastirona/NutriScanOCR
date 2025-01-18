import express from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/uploadController';

// create a new router
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const uploadController = new UploadController();

// Middleware to log file details
const logFileDetails = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.file) {
        console.log('File received by multer:');
        console.log('Fieldname:', req.file.fieldname);
        console.log('Originalname:', req.file.originalname);
        console.log('Encoding:', req.file.encoding);
        console.log('Mimetype:', req.file.mimetype);
        console.log('Buffer length:', req.file.buffer.length);
        console.log('Buffer content (first 20 bytes):', req.file.buffer.slice(0, 20));
    } else {
        console.log('No file received by multer.');
    }
    next();
};

// define upload routes
router.post('/upload-label',
    upload.single('image'),
    logFileDetails,
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