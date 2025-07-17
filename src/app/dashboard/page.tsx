
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Share2, RefreshCw, Bot, History as HistoryIcon, CornerDownLeft, Palette } from 'lucide-react';
import { dualAIImageGeneration } from '@/ai/flows/dual-ai-image-generation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { HistoryItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [openAiResult, setOpenAiResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setGeminiResult(null);
      setOpenAiResult(null);

      try {
        const result = await dualAIImageGeneration({ prompt, aspectRatio });
        setGeminiResult(result.geminiImageUrl);
        setOpenAiResult(result.openAIImageUrl);
        
        const newHistoryItem: HistoryItem = {
          id: new Date().toISOString(),
          prompt,
          geminiImageUrl: result.geminiImageUrl,
          openAIImageUrl: result.openAIImageUrl,
          timestamp: new Date().toLocaleString(),
        };
        setHistory(prev => [newHistoryItem, ...prev]);

      } catch (error) {
        console.error(error);
        toast({
          title: 'Generation Failed',
          description: 'Could not generate images. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  }

  const ImageResultCard = ({ src, source }: { src: string | null; source: 'Gemini' | 'OpenAI' }) => (
    <Card className="flex-1 min-w-[300px] shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} />
          {source} Result
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full rounded-lg overflow-hidden border">
          {isPending && !src ? (
            <Skeleton className="w-full h-full" />
          ) : src ? (
            <Image src={src} alt={`${source} generated image`} width={512} height={512} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Palette className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="icon" disabled={!src || isPending}>
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" disabled={!src || isPending}>
          <Share2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleGenerate} disabled={isPending}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Image Generation</CardTitle>
              <CardDescription>Describe the image you want to create. Be as detailed as possible.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Textarea
                id="prompt"
                placeholder="A cinematic shot of a raccoon astronaut on a neon-lit alien planet..."
                className="min-h-32"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatios.map((ratio) => (
                    <SelectItem key={ratio} value={ratio}>
                      {ratio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
              <Button onClick={handleGenerate} disabled={isPending} className="font-bold">
                {isPending ? 'Generating...' : 'Generate Image'}
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Press <Badge variant="secondary" className="px-1.5 py-0.5"><CornerDownLeft className="w-3 h-3 mr-1" />+Enter</Badge> to generate
              </div>
            </CardFooter>
          </Card>

          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HistoryIcon className="w-5 h-5" /> Session History</CardTitle>
                <CardDescription>Your generated prompts in this session.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {history.map(item => (
                    <div key={item.id} onClick={() => setPrompt(item.prompt)} className="text-sm p-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
                      <p className="truncate text-foreground">{item.prompt}</p>
                      <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col md:flex-row gap-8">
          <ImageResultCard src={geminiResult} source="Gemini" />
          <ImageResultCard src={openAiResult} source="OpenAI" />
        </div>
      </div>
    </div>
  );
}
