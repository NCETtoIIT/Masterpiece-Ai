'use server';

/**
 * @fileOverview AI Product Photoshoot flow.
 *
 * - aiProductPhotoshoot - Generates two professional-looking photoshoot images of a product in different settings, using both Gemini and a simulated OpenAI model.
 * - AIProductPhotoshootInput - The input type for the aiProductPhotoshoot function.
 * - AIProductPhotoshootOutput - The return type for the aiProductPhotoshoot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProductPhotoshootInputSchema = z.object({
  productPhotoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  settingDescription: z.string().describe('The desired setting for the photoshoot image.'),
});
export type AIProductPhotoshootInput = z.infer<typeof AIProductPhotoshootInputSchema>;

const AIProductPhotoshootOutputSchema = z.object({
  geminiImage: z.string().describe('The AI-generated image from Gemini as a data URI.'),
  openAIImage: z.string().describe('The AI-generated image from OpenAI as a data URI.'),
});
export type AIProductPhotoshootOutput = z.infer<typeof AIProductPhotoshootOutputSchema>;

export async function aiProductPhotoshoot(input: AIProductPhotoshootInput): Promise<AIProductPhotoshootOutput> {
  return aiProductPhotoshootFlow(input);
}

const aiProductPhotoshootFlow = ai.defineFlow(
  {
    name: 'aiProductPhotoshootFlow',
    inputSchema: AIProductPhotoshootInputSchema,
    outputSchema: AIProductPhotoshootOutputSchema,
  },
  async (input) => {
    const promptText = `Generate a professional product photoshoot image. Place the product from the image into the following setting: ${input.settingDescription}. Ensure the composition, lighting, and overall aesthetic are suitable for professional product photography.`;

    const geminiRequest = ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          { text: promptText },
          { media: { url: input.productPhotoDataUri } },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
  
      // Simulate OpenAI call using another Gemini call
      const openAiRequest = ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: [
            { text: promptText },
            { media: { url: input.productPhotoDataUri } },
          ],
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
  
      const [geminiResult, openAiResult] = await Promise.all([geminiRequest, openAiRequest]);

    return {
      geminiImage: geminiResult.media?.url ?? '',
      openAIImage: openAiResult.media?.url ?? '',
    };
  }
);
