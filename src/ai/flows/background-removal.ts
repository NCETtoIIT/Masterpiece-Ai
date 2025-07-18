
// src/ai/flows/background-removal.ts
'use server';

/**
 * @fileOverview AI-powered background removal flow.
 *
 * This file defines a Genkit flow that allows users to remove the background from an image.
 * It takes an image as input and returns the image with the background removed.
 *
 * @param {BackgroundRemovalInput} input - The input to the background removal flow.
 * @returns {Promise<BackgroundRemovalOutput>} - The output of the background removal flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BackgroundRemovalInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to remove the background from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type BackgroundRemovalInput = z.infer<typeof BackgroundRemovalInputSchema>;

const BackgroundRemovalOutputSchema = z.object({
  removedBackgroundDataUri: z
    .string()
    .describe(
      'The photo with the background removed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type BackgroundRemovalOutput = z.infer<typeof BackgroundRemovalOutputSchema>;

export async function removeBackground(input: BackgroundRemovalInput): Promise<BackgroundRemovalOutput> {
  return removeBackgroundFlow(input);
}

const removeBackgroundFlow = ai.defineFlow(
  {
    name: 'removeBackgroundFlow',
    inputSchema: BackgroundRemovalInputSchema,
    outputSchema: BackgroundRemovalOutputSchema,
  },
  async input => {
    try {
      // Use Gemini 2.0 Flash to remove the background.
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: 'Remove the background of this image.'},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
      });
  
      if (!media?.url) {
        throw new Error('No media returned from background removal.');
      }
  
      return {removedBackgroundDataUri: media.url};
    } catch (error) {
      console.error('Error in removeBackgroundFlow:', error);
      throw new Error('Failed to remove background. The AI service may be temporarily unavailable.');
    }
  }
);
