
'use client';

import { getCropIdentification } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ScanLine, Tag, Leaf, Sun, Bug } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type IdentificationResult = {
  cropName: string;
  estimatedPrice: string;
  description: string;
  growingConditions: string;
  commonPestsAndDiseases: string;
};

export function CropIdentifier() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setImageData(dataUrl);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!imageData) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload an image first.',
      });
      return;
    }
    setResult(null);

    startTransition(async () => {
      const response = await getCropIdentification({ photoDataUri: imageData });
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="crop-image">Upload Crop Image</Label>
        <Input
          id="crop-image"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="file:text-foreground"
        />
      </div>

      {imagePreview && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <Image
            src={imagePreview}
            alt="Crop preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isPending || !imageData}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isPending ? 'Analyzing...' : 'Identify Crop & Estimate Price'}
        <ScanLine className="ml-2 h-4 w-4" />
      </Button>

      {isPending && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
           <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        </div>
      )}

      {result && (
        <div className="pt-4 space-y-4">
          <h3 className="font-headline text-lg">Analysis Result</h3>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Tag className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Crop Name</p>
              <p className="font-semibold">{result.cropName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <DollarSign className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Price</p>
              <p className="font-semibold">{result.estimatedPrice}</p>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  Description
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                {result.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="growing-conditions">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center gap-3">
                 <Sun className="h-5 w-5 text-primary" />
                  Growing Conditions
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                {result.growingConditions}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pests-diseases">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center gap-3">
                  <Bug className="h-5 w-5 text-primary" />
                  Common Pests & Diseases
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                {result.commonPestsAndDiseases}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
