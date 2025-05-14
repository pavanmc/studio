
'use server';
/**
 * @fileOverview An AI agent for extracting text from images or PDF files (OCR).
 *
 * - extractTextFromFile - A function that handles the text extraction process.
 * - ExtractTextFromFileInput - The input type for the extractTextFromFile function.
 * - ExtractTextFromFileOutput - The return type for the extractTextFromFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromFileInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A photo, scanned image, or PDF file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromFileInput = z.infer<typeof ExtractTextFromFileInputSchema>;

const ExtractTextFromFileOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the file. Returns an empty string if no text is found or discernible.'),
});
export type ExtractTextFromFileOutput = z.infer<typeof ExtractTextFromFileOutputSchema>;

export async function extractTextFromFile(input: ExtractTextFromFileInput): Promise<ExtractTextFromFileOutput> {
  return extractTextFromFileFlow(input);
}

const extractTextPrompt = ai.definePrompt({
  name: 'extractTextFromFilePrompt',
  input: {schema: ExtractTextFromFileInputSchema},
  output: {schema: ExtractTextFromFileOutputSchema},
  prompt: `You are an Optical Character Recognition (OCR) specialist.
Your task is to extract all discernible text from the provided file (image or PDF).
For PDF files, extract text from all relevant pages.
Return only the extracted text.
If no text is found, or the file does not appear to contain any legible text, return an empty string.
Do not add any explanations or apologies if no text is found. Just return the text or an empty string.

File for OCR: {{media url=fileDataUri}}`,
});

const extractTextFromFileFlow = ai.defineFlow(
  {
    name: 'extractTextFromFileFlow',
    inputSchema: ExtractTextFromFileInputSchema,
    outputSchema: ExtractTextFromFileOutputSchema,
  },
  async (input: ExtractTextFromFileInput) => {
    const {output} = await extractTextPrompt(input);
    return output!;
  }
);

