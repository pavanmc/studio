
'use server';
/**
 * @fileOverview An AI agent for extracting text from images (OCR).
 *
 * - extractTextFromImage - A function that handles the text extraction process.
 * - ExtractTextFromImageInput - The input type for the extractTextFromImage function.
 * - ExtractTextFromImageOutput - The return type for the extractTextFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo or scanned image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromImageInput = z.infer<typeof ExtractTextFromImageInputSchema>;

const ExtractTextFromImageOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the image. Returns an empty string if no text is found or discernible.'),
});
export type ExtractTextFromImageOutput = z.infer<typeof ExtractTextFromImageOutputSchema>;

export async function extractTextFromImage(input: ExtractTextFromImageInput): Promise<ExtractTextFromImageOutput> {
  return extractTextFromImageFlow(input);
}

const extractTextPrompt = ai.definePrompt({
  name: 'extractTextFromImagePrompt',
  input: {schema: ExtractTextFromImageInputSchema},
  output: {schema: ExtractTextFromImageOutputSchema},
  prompt: `You are an Optical Character Recognition (OCR) specialist.
Your task is to extract all discernible text from the provided image.
Return only the extracted text.
If no text is found, or the image does not appear to contain any legible text, return an empty string.
Do not add any explanations or apologies if no text is found. Just return the text or an empty string.

Image for OCR: {{media url=imageDataUri}}`,
  // Model choice is important here. Gemini Flash may not be the best for OCR.
  // Gemini Pro Vision or a model specifically good at OCR would be better if available and configured.
  // For now, we'll rely on the default model configured in ai.ts or hope Gemini Flash handles it.
  // Consider using a model like 'gemini-pro-vision' if available, or a more specialized OCR model.
  // Forcing gemini-2.0-flash for now as it's the default in the project.
  // model: 'googleai/gemini-pro-vision', // Ideal, but may not be configured
});

const extractTextFromImageFlow = ai.defineFlow(
  {
    name: 'extractTextFromImageFlow',
    inputSchema: ExtractTextFromImageInputSchema,
    outputSchema: ExtractTextFromImageOutputSchema,
  },
  async (input: ExtractTextFromImageInput) => {
    // Ensure the model can handle media input.
    // If using a model that requires specific configuration for media, adjust here.
    const {output} = await extractTextPrompt(input);
    return output!;
  }
);
