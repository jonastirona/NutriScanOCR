import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

// class to preprocess and upload images to an S3 bucket
export class ImageService {
    private s3: S3Client;
    private bucketName: string;

    // initialize the S3 client and bucket name
    constructor() {
        this.s3 = new S3Client({ region: process.env.AWS_S3_BUCKET_REGION });
        this.bucketName = process.env.AWS_S3_BUCKET || '';
        console.log('Bucket Name:', this.bucketName);

        if (!this.bucketName) {
            throw new Error('AWS_S3_BUCKET environment variable is not set');
        }
    }

    // preprocess an image using sharp
    async preprocessImage(buffer: Buffer): Promise<Buffer> {
        return sharp(buffer)
            .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .normalize()
            .sharpen()
            .toBuffer();
    }

    // upload an image to the S3 bucket
    async uploadImage(buffer: Buffer, filename: string): Promise<string> {
        const processedBuffer = await this.preprocessImage(buffer);

        const params = {
            Bucket: this.bucketName,
            Key: `uploads/${Date.now()}-${filename}`,
            Body: processedBuffer,
            ContentType: 'image/jpeg'
        };

        const upload = new Upload({
            client: this.s3,
            params
        });

        const result = await upload.done();
        return result.Key || '';
    }
}