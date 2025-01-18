# NutriScanOCR 🔍

> Transform food label images into structured nutritional data with serverless OCR technology

## Overview

NutriScanOCR is a powerful serverless API that extracts nutritional information from food label images using advanced OCR technology and intelligent text parsing. Built with AWS Lambda and Textract, it provides accurate, structured data for calories, macronutrients, vitamins, minerals, and serving sizes.

## Key Features

- **Serverless Architecture**: Highly scalable AWS Lambda-based solution with automatic scaling
- **Advanced Image Processing**: 
  - Automatic image optimization and enhancement
  - Support for JPEG, PNG, BMP, TIFF, and GIF formats
  - Smart cropping and rotation correction
- **Comprehensive Nutrient Detection**:
  - Macronutrients (proteins, fats, carbohydrates)
  - Detailed fat breakdown (saturated, trans, poly/monounsaturated)
  - Vitamins and minerals
  - Serving size information
- **Data Validation & Correction**:
  - Boundary value checking
  - Unit standardization
  - Manual correction capabilities
- **Developer-Friendly**:
  - RESTful API interface
  - Comprehensive error handling
  - CORS support
  - Detailed response formatting

## Technologies Used

- Backend

  - ![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)

  - ![Node.js](https://img.shields.io/badge/Node.js-18.x-green)

  - ![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey)

- Image Processing & OCR

  - ![AWS Textract](https://img.shields.io/badge/AWS_Textract-3.x-orange)

  - ![Sharp](https://img.shields.io/badge/Sharp-0.33.5-yellow)

  - ![File Type](https://img.shields.io/badge/File_Type-16.5.4-lightblue)

- Cloud Infrastructure

  - ![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-Serverless-orange)

  - ![AWS S3](https://img.shields.io/badge/AWS_S3-Storage-orange)

  - ![Serverless Framework](https://img.shields.io/badge/Serverless-3.x-red)

- Testing

  - ![Jest](https://img.shields.io/badge/Jest-29.7.0-red)

  - ![Supertest](https://img.shields.io/badge/Supertest-7.0.0-green)

## Installation

### Prerequisites

- Node.js >= 18.0.0
- AWS Account with appropriate permissions
- AWS CLI configured locally

### Setup

1. Clone the repository:
```bash
git clone https://github.com/jonastirona/NutriScanOCR.git
cd NutriScanOCR
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your AWS credentials and configuration:
```
AWS_S3_BUCKET=your-bucket-name
AWS_S3_BUCKET_REGION=your-region
PORT=3000
```

4. Build the project:
```bash
npm run build
```

## Usage

### Quick Start

1. Start the local development server:
```bash
npm run dev
```

2. Upload an image and get nutritional data:
```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:3000/api/upload-label', {
  method: 'POST',
  body: formData,
  headers: {
    'Accept': 'application/json'
  }
});

const { id, data } = await response.json();
```

3. Retrieve parsed data:
```javascript
const response = await fetch(`http://localhost:3000/api/parsed-data/${id}`);
const { data } = await response.json();
```

4. Validate and update parsed data:
```javascript
const updatedData = {
  calories: "250",
  totalFat: "12g",
  // other nutritional data updates
};

const response = await fetch(`http://localhost:3000/api/validate-data/${id}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(updatedData)
});

const { message, data } = await response.json();
```

5. Check the health status of the API:
```javascript
const response = await fetch('http://localhost:3000/api/health-check');
const { status } = await response.json();
```

### API Endpoints

- `POST /upload-label`: Upload food label image
- `GET /parsed-data/:id`: Retrieve parsed nutritional data
- `POST /validate-data/:id`: Update/correct parsed data
- `GET /health-check`: API health status

## Configuration

### AWS Configuration

Update `serverless.yml` for custom AWS configuration:

```yaml
provider:
  name: aws
  runtime: nodejs18.x
  region: your-region
  memorySize: 512
  timeout: 29
```

### Image Processing

Adjust image processing parameters in `src/services/imageService.ts`:

```typescript
const processedBuffer = await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
```

## Contributing

Please contribute! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

## Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

## Deployment

1. Package the application:
```bash
npm run package
```

2. Deploy to AWS:
```bash
npm run deploy
```

## Future Developments

- [ ] Machine learning enhancement for non-standard label formats
- [ ] Support for multiple languages
- [ ] Ingredient list parsing and allergen detection
- [ ] Batch processing capabilities
- [ ] Integration with popular nutrition apps
- [ ] Real-time image processing feedback

## Troubleshooting

### Common Issues

1. **Image Upload Fails**
   - Ensure image is under 10MB
   - Check supported file formats
   - Verify AWS credentials

2. **Parsing Inaccuracies**
   - Ensure image is clear and well-lit
   - Check if label follows standard format
   - Use validation endpoint for corrections

3. **Deployment Issues**
   - Verify AWS credentials
   - Check IAM roles and permissions
   - Ensure all environment variables are set

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.