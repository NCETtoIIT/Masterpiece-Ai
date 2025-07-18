
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { aiAvatarGenerator } from '@/ai/flows/ai-avatar-generator';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/image-upload';
import { Bot, UserRound, Download, Share2, RefreshCw } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function AvatarPage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [openAiResult, setOpenAiResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!userImage || !theme) {
      toast({
        title: 'Error',
        description: 'Please upload a photo and enter a theme for your avatar.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setGeminiResult(null);
      setOpenAiResult(null);
      try {
        const result = await aiAvatarGenerator({
          photoDataUri: userImage,
          theme,
        });
        setGeminiResult(result.geminiAvatar);
        setOpenAiResult(result.openAiAvatar);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Generation Failed',
          description: 'Could not generate avatars. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDownload = (imageSrc: string | null, filename: string) => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (imageSrc: string | null) => {
    if (!imageSrc) return;
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: blob.type });

      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: 'AI Generated Avatar',
            text: 'Check out my new avatar!',
          });
          return; // Early return if share is successful
        } catch (shareError) {
           // If sharing fails, fall through to clipboard copy
           console.error('Sharing failed, falling back to clipboard:', shareError);
        }
      }
      
      // Fallback to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ [file.type]: file })
      ]);
      toast({ title: 'Success', description: 'Image copied to clipboard.' });

    } catch (error) {
      console.error('Sharing or copying failed', error);
      toast({ title: 'Error', description: 'Could not share or copy the image.', variant: 'destructive' });
    }
  };

  const ImageResultCard = ({ src, source }: { src: string | null; source: 'Gemini' | 'OpenAI' }) => (
    <Card className="flex-1 min-w-[300px] shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot size={20} />{source} Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full rounded-lg overflow-hidden border">
          {isPending && !src ? (
            <Skeleton className="w-full h-full" />
          ) : src ? (
            <Image src={src} alt={`${source} generated image`} width={512} height={512} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <UserRound className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="icon" onClick={() => handleDownload(src, `${source.toLowerCase()}-avatar.png`)} disabled={!src || isPending}><Download className="w-4 h-4" /></Button>
        <Button variant="outline" size="icon" onClick={() => handleShare(src)} disabled={!src || isPending}><Share2 className="w-4 h-4" /></Button>
        <Button variant="outline" size="icon" onClick={handleGenerate} disabled={!userImage || !theme || isPending}><RefreshCw className="w-4 h-4" /></Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>AI Avatar Generator</CardTitle>
              <CardDescription>Upload your photo and choose a theme to create a unique avatar.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <ImageUpload onFileChange={setUserImage} />
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  placeholder="e.g., cyberpunk, fantasy hero, professional headshot"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={!userImage || !theme || isPending} className="w-full font-bold">
                {isPending ? 'Generating...' : 'Generate Avatar'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col md:flex-row gap-8">
          <ImageResultCard src={geminiResult} source="Gemini" />
          <ImageResultCard src={openAiResult} source="OpenAI" />
        </div>
      </div>
    </div>
  );
}
