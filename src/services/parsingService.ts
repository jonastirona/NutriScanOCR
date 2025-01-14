export class ParsingService {
    // method to parse the extracted text and identify key nutritional fields
    parseText(text: string): Record<string, string> {
        const parsedData: Record<string, string> = {};

        // regex patterns for key nutritional fields
        const patterns = {
            calories: /calories\s*:\s*(\d+)/i,
            totalFat: /total\s*fat\s*:\s*(\d+\.?\d*)\s*g/i,
            saturatedFat: /saturated\s*fat\s*:\s*(\d+\.?\d*)\s*g/i,
            cholesterol: /cholesterol\s*:\s*(\d+\.?\d*)\s*mg/i,
            sodium: /sodium\s*:\s*(\d+\.?\d*)\s*mg/i,
            totalCarbohydrates: /total\s*carbohydrates\s*:\s*(\d+\.?\d*)\s*g/i,
            dietaryFiber: /dietary\s*fiber\s*:\s*(\d+\.?\d*)\s*g/i,
            sugars: /sugars\s*:\s*(\d+\.?\d*)\s*g/i,
            protein: /protein\s*:\s*(\d+\.?\d*)\s*g/i,
            servingSize: /serving\s*size\s*:\s*(\d+\.?\d*)\s*g/i
        };

        // apply regex to text
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                parsedData[key] = match[1];
            }
        }

        return parsedData;
    }
}