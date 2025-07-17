'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { removeBackground } from '@/ai/flows/background-removal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/image-upload';
import Image from 'next/image';
import { Download, Share2, Scissors, Wand2 } from 'lucide-react';

export default function RemoveBgPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRemove = () => {
    if (!originalImage) {
      toast({
        title: 'Error',
        description: 'Please upload an image to remove its background.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setResultImage(null);
      try {
        const result = await removeBackground({ photoDataUri: originalImage });
        setResultImage(result.removedBackgroundDataUri);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Removal Failed',
          description: 'Could not remove the background. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Background Removal</CardTitle>
          <CardDescription>Upload an image to automatically remove the background.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload onFileChange={setOriginalImage} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleRemove} disabled={!originalImage || isPending} className="w-full font-bold">
            <Wand2 className="mr-2 h-4 w-4" />
            {isPending ? 'Removing...' : 'Remove Background'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>The image with the background removed will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full rounded-lg overflow-hidden border">
            {isPending ? (
              <Skeleton className="w-full h-full" />
            ) : resultImage ? (
              <div className="w-full h-full p-4" style={{
                backgroundImage: 'repeating-conic-gradient(#e5e7eb 0 25%, transparent 0 50%)',
                backgroundSize: '1.5rem 1.5rem',
              }}>
                <Image src={resultImage} alt="Result image" width={512} height={512} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Scissors className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="gap-2">
            <Button variant="outline" size="icon" disabled={!resultImage || isPending}><Download className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" disabled={!resultImage || isPending}><Share2 className="w-4 h-4" /></Button>
        </CardFooter>
      </Card>
    </div>
  );
}
