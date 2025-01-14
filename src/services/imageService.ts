import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { ParsingService } from './parsingService';

// service class to handle image processing and text extraction
export class ImageService {
    private s3: S3Client;
    private textract: TextractClient;
    private parsingService: ParsingService;
    private bucketName: string;

    constructor() {
        this.s3 = new S3Client({ region: process.env.AWS_S3_BUCKET_REGION });
        this.textract = new TextractClient({ region: process.env.AWS_S3_BUCKET_REGION });
        this.parsingService = new ParsingService();
        this.bucketName = process.env.AWS_S3_BUCKET || '';
        console.log('Bucket Name:', this.bucketName);

        if (!this.bucketName) {
            throw new Error('AWS_S3_BUCKET environment variable is not set');
        }
    }

    // method to preprocess an image using sharp
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

    // method to upload an image to S3 and extract text using textract
    async uploadImage(buffer: Buffer, filename: string): Promise<Record<string, string>> {
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
        const imageKey = result.Key || '';

        // trigger textract after uploading the image
        const text = await this.extractTextFromImage(imageKey);

        // parse the extracted text
        const parsedData = this.parsingService.parseText(text);
        return parsedData;
    }

    // method to extract text from an image using textract
    async extractTextFromImage(imageKey: string): Promise<string> {
        const params = {
            Document: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: imageKey
                }
            }
        };

        const command = new DetectDocumentTextCommand(params);
        const response = await this.textract.send(command);

        const text = response.Blocks?.filter(block => block.BlockType === 'LINE')
            .map(block => block.Text)
            .join('\n') || '';

        return text;
    }
}