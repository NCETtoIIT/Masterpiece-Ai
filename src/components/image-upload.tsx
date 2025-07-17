'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  onFileChange: (dataUri: string) => void;
  className?: string;
}

export function ImageUpload({ onFileChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const dataUri = e.target?.result as string;
          setPreview(dataUri);
          onFileChange(dataUri);
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setPreview(null);
    onFileChange('');
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
        className
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <>
          <Image src={preview} alt="Image preview" width={200} height={200} className="max-h-64 w-auto rounded-md object-contain" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 rounded-full bg-background/50 hover:bg-background"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
}
