export class ParsingService {
    // method to parse the extracted text and identify key nutritional fields
    parseText(text: string): Record<string, string> {
        const parsedData: Record<string, string> = {};

        // regex patterns for nutritional fields
        const patterns = {
            calories: /calories\s*(\d+)/i,
            totalFat: /total\s*fat\s*(\d+\.?\d*)\s*g/i,
            saturatedFat: /saturated\s*fat\s*(\d+\.?\d*)\s*g/i,
            transFat: /trans\s*fat\s*(\d+\.?\d*)\s*g/i,
            polyunsaturatedFat: /polyunsaturated\s*fat\s*(\d+\.?\d*)\s*g/i,
            monounsaturatedFat: /monounsaturated\s*fat\s*(\d+\.?\d*)\s*g/i,
            cholesterol: /cholesterol\s*(\d+\.?\d*)\s*mg/i,
            sodium: /sodium\s*(\d+\.?\d*)\s*mg/i,
            potassium: /potassium\s*(\d+\.?\d*)\s*mg/i,
            totalCarbohydrates: /total\s*carbohydrate\s*(\d+\.?\d*)\s*g/i,
            dietaryFiber: /dietary\s*fiber\s*(\d+\.?\d*)\s*g/i,
            solubleFiber: /soluble\s*fiber\s*(\d+\.?\d*)\s*g/i,
            insolubleFiber: /insoluble\s*fiber\s*(\d+\.?\d*)\s*g/i,
            sugars: /sugars\s*(\d+\.?\d*)\s*g/i,
            addedSugars: /added\s*sugars\s*(\d+\.?\d*)\s*g/i,
            sugarAlcohols: /sugar\s*alcohols\s*(\d+\.?\d*)\s*g/i,
            protein: /protein\s*(\d+\.?\d*)\s*g/i,
            servingSize: /serving\s*size\s*([\d\.]+)\s*(g|oz|ml|cup|tbsp|tsp)/i,
            vitaminA: /vitamin\s*a\s*(\d+\.?\d*)\s*(iu|mcg|mg)/i,
            vitaminC: /vitamin\s*c\s*(\d+\.?\d*)\s*(mg|g)/i,
            vitaminD: /vitamin\s*d\s*(\d+\.?\d*)\s*(iu|mcg)/i,
            vitaminE: /vitamin\s*e\s*(\d+\.?\d*)\s*(mg|iu)/i,
            vitaminK: /vitamin\s*k\s*(\d+\.?\d*)\s*(mcg|mg)/i,
            calcium: /calcium\s*(\d+\.?\d*)\s*(mg|g)/i,
            iron: /iron\s*(\d+\.?\d*)\s*(mg|g)/i,
            magnesium: /magnesium\s*(\d+\.?\d*)\s*(mg|g)/i,
            zinc: /zinc\s*(\d+\.?\d*)\s*(mg|mcg)/i,
            selenium: /selenium\s*(\d+\.?\d*)\s*(mcg|mg)/i,
            copper: /copper\s*(\d+\.?\d*)\s*(mg|mcg)/i,
            manganese: /manganese\s*(\d+\.?\d*)\s*(mg|mcg)/i,
            phosphorus: /phosphorus\s*(\d+\.?\d*)\s*(mg|g)/i,
            folate: /folate\s*(\d+\.?\d*)\s*(mcg|mg)/i,
            niacin: /niacin\s*(\d+\.?\d*)\s*(mg|mcg)/i,
            riboflavin: /riboflavin\s*(\d+\.?\d*)\s*(mg|mcg)/i,
            thiamin: /thiamin\s*(\d+\.?\d*)\s*(mg|mcg)/i,
            biotin: /biotin\s*(\d+\.?\d*)\s*(mcg|mg)/i,
            pantothenicAcid: /pantothenic\s*acid\s*(\d+\.?\d*)\s*(mg|mcg)/i,
            iodine: /iodine\s*(\d+\.?\d*)\s*(mcg|mg)/i,
            chromium: /chromium\s*(\d+\.?\d*)\s*(mcg|mg)/i,
            molybdenum: /molybdenum\s*(\d+\.?\d*)\s*(mcg|mg)/i,
            chloride: /chloride\s*(\d+\.?\d*)\s*(mg|g)/i,
        };

        // apply regex to text
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                parsedData[key] = match[1] + (match[2] ? ` ${match[2]}` : '');
            }
        }

        return parsedData;
    }
}
