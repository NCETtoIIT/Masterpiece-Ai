'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { enhanceImageQuality } from '@/ai/flows/enhance-image-quality';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/image-upload';
import { ImageComparison } from '@/components/image-comparison';
import { Bot, Download, Share2, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function EnhancePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [openAiResult, setOpenAiResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleEnhance = () => {
    if (!originalImage) {
      toast({
        title: 'Error',
        description: 'Please upload an image to enhance.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setGeminiResult(null);
      setOpenAiResult(null);

      try {
        const result = await enhanceImageQuality({ photoDataUri: originalImage });
        setGeminiResult(result.enhancedImageGemini);
        setOpenAiResult(result.enhancedImageOpenAI);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Enhancement Failed',
          description: 'Could not enhance the image. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const ResultCard = ({ title, before, after }: { title: string, before: string | null, after: string | null }) => (
    <Card className="flex-1 min-w-[300px] shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} /> {title} Result
        </CardTitle>
        <CardDescription>Slide to compare before and after.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && !after ? <Skeleton className="w-full aspect-square" /> :
         (before && after) ? <ImageComparison before={before} after={after} /> :
         <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-lg">
          <Sparkles className="w-16 h-16 text-muted-foreground/30" />
         </div>
        }
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="icon" disabled={!after || isPending}><Download className="w-4 h-4" /></Button>
        <Button variant="outline" size="icon" disabled={!after || isPending}><Share2 className="w-4 h-4" /></Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Image Enhancement</CardTitle>
            <CardDescription>Upload an image to improve its quality up to 16K resolution.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload onFileChange={setOriginalImage} />
          </CardContent>
          <CardFooter>
            <Button onClick={handleEnhance} disabled={!originalImage || isPending} className="w-full font-bold">
              {isPending ? 'Enhancing...' : 'Enhance Image'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-2 flex flex-col md:flex-row gap-8">
        <ResultCard title="Gemini" before={originalImage} after={geminiResult} />
        <ResultCard title="OpenAI" before={originalImage} after={openAiResult} />
      </div>
    </div>
  );
}
