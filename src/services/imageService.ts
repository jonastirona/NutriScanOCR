import { S3 } from 'aws-sdk';
import sharp from 'sharp';

export class ImageService {
    private s3: S3;
    private bucketName: string;

    constructor() {
        this.s3 = new S3();
        this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    }

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

    async uploadImage(buffer: Buffer, filename: string): Promise<string> {
        const processedBuffer = await this.preprocessImage(buffer);
        
        const params = {
            Bucket: this.bucketName,
            Key: `uploads/${Date.now()}-${filename}`,
            Body: processedBuffer,
            ContentType: 'image/jpeg'
        };

        const result = await this.s3.upload(params).promise();
        return result.Key;
    }
}