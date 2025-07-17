'use server';

/**
 * @fileOverview AI Product Photoshoot flow.
 *
 * - aiProductPhotoshoot - Generates two professional-looking photoshoot images of a product in different settings, using both Gemini and OpenAI.
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

const prompt = ai.definePrompt({
  name: 'aiProductPhotoshootPrompt',
  input: {schema: AIProductPhotoshootInputSchema},
  output: {schema: AIProductPhotoshootOutputSchema},
  prompt: `You are a professional photographer specializing in product photography.

You will generate two images of the product in the setting described by the user, using the product photo as a reference.

Generate one image using Gemini and another using OpenAI.

Product Photo: {{media url=productPhotoDataUri}}
Setting: {{{settingDescription}}}

Ensure that the composition, lighting, and overall aesthetic of each generated image are suitable for professional product photography.

Output should be JSON with two fields:
- geminiImage: The AI-generated image from Gemini as a data URI.
- openAIImage: The AI-generated image from OpenAI as a data URI.
`,
});

const aiProductPhotoshootFlow = ai.defineFlow(
  {
    name: 'aiProductPhotoshootFlow',
    inputSchema: AIProductPhotoshootInputSchema,
    outputSchema: AIProductPhotoshootOutputSchema,
  },
  async input => {
    // TODO: Replace the following with actual calls to Gemini and OpenAI.
    // For now, return dummy data URIs.
    const {output} = await prompt(input);
    return output!;
  }
);
