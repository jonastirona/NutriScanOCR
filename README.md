# NutriScan OCR API

An API for extracting nutritional information from food labels using OCR and ML.

## 🚧 Project Status: In Development

This project is currently in early development. Features and documentation will be updated as development progresses.

## 🎯 Project Overview

NutriScan OCR API is a serverless solution that helps extract nutritional information from food label images. Using advanced OCR and text parsing, it provides structured data including calories, macronutrients, serving sizes, and more.

### Key Features (Planned)
- 📸 Image Upload & Processing
- 🔍 OCR Text Extraction
- 📊 Nutritional Data Parsing
- 🔄 JSON API Responses
- 📱 Mobile App Integration
- 🔐 Secure Data Handling

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Language**: TypeScript
- **Cloud Services**: AWS (S3, Lambda, Textract)
- **API Documentation**: OpenAPI/Swagger (coming soon)
- **Testing**: Jest (coming soon)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- AWS Account
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nutriscan-ocr-api
cd nutriscan-ocr-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```plaintext
NODE_ENV=development
PORT=3000
AWS_REGION=us-east-1
# Add your AWS credentials after setting up AWS
```

4. Start the development server:
```bash
npm run dev
```

### AWS Setup Requirements

1. AWS Account with access to:
   - S3
   - Lambda
   - Textract
   
2. Required AWS Permissions:
   - AWSLambdaFullAccess
   - AmazonS3FullAccess
   - AWSTextractFullAccess

## 📝 API Documentation

### Planned Endpoints

- `GET /health-check`: API health status check

More endpoints coming soon:
- `POST /upload-label`: Upload food label image
- `GET /parsed-data`: Get extracted nutritional data

## 🔜 Upcoming Features

- [ ] Image upload functionality
- [ ] OCR processing
- [ ] Nutritional data parsing
- [ ] Data validation
- [ ] Error handling
- [ ] API documentation
- [ ] Test coverage

## 💻 Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests (coming soon)
npm test
```

## 🤝 Contributing

This project is currently in early development. Contribution guidelines will be added soon.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.