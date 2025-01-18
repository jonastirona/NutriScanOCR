import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { ParsingService } from './parsingService';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

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

        if (!this.bucketName) {
            throw new Error('AWS_S3_BUCKET environment variable is not set');
        }
    }

    async preprocessImage(buffer: Buffer): Promise<Buffer> {
        try {
            // Log the first few bytes of the buffer for debugging
            console.log('Buffer head (first 20 bytes):', buffer.subarray(0, 20)); // Corrected to use subarray

            const type = await fileTypeFromBuffer(buffer);
            console.log('Detected file type:', type);

            if (!type || !['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/gif'].includes(type.mime)) {
                throw new Error('Unsupported image format');
            }

            const processedBuffer = await sharp(buffer)
                .resize({ width: 1200, withoutEnlargement: true })
                .jpeg({ quality: 90 })
                .toBuffer();

            return processedBuffer;
        } catch (error) {
            console.error('Sharp image processing error:', error);
            throw new Error('Failed to process image with Sharp');
        }
    }

    // method to upload an image to S3 and extract text using textract
    async uploadImage(buffer: Buffer, filename: string, mimetype: string): Promise<Record<string, string>> {
        console.log('Received buffer size:', buffer.length);

        const processedBuffer = await this.preprocessImage(buffer);

        const params = {
            Bucket: this.bucketName,
            Key: `uploads/${Date.now()}-${filename}`,
            Body: processedBuffer,
            ContentType: 'image/jpeg' // Set content type to JPEG after processing
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