'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  before: string;
  after: string;
  altBefore?: string;
  altAfter?: string;
  className?: string;
}

export function ImageComparison({
  before,
  after,
  altBefore = 'Before',
  altAfter = 'After',
  className,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className={cn('relative w-full aspect-square overflow-hidden rounded-lg group', className)}>
      <Image src={before} alt={altBefore} layout="fill" objectFit="contain" />
      <div
        className="absolute top-0 left-0 h-full w-full"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <Image src={after} alt={altAfter} layout="fill" objectFit="contain" />
      </div>
      <div className="absolute inset-0">
        <Slider
          value={[sliderPosition]}
          onValueChange={(value) => setSliderPosition(value[0])}
          max={100}
          step={0.1}
          className="h-full opacity-0 cursor-col-resize"
        />
        <div
          className="absolute top-0 h-full w-1 bg-primary/70 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        />
      </div>
    </div>
  );
}
