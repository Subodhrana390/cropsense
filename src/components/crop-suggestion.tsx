
'use client';

import {
  getChatbotResponse,
  getSuggestions,
  getLocationFromCoords,
} from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Sprout, Info, MapPin, LoaderCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  season: z.string({ required_error: 'Please select a season.' }),
  soilType: z.string({ required_error: 'Please select a soil type.' }),
});

type CropInfo = {
  crop: string;
  details: string;
};

export function CropSuggestion() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const [selectedCropInfo, setSelectedCropInfo] = useState<CropInfo | null>(
    null
  );
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setHasSearched(true);
    setSuggestions([]);
    setSelectedCropInfo(null);
    startTransition(async () => {
      const result = await getSuggestions(values);
      if (result.success) {
        setSuggestions(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  }

  const handleSuggestionClick = async (crop: string) => {
    setIsFetchingDetails(true);
    setSelectedCropInfo(null);

    const query = `Provide detailed information about growing ${crop} in India. Include its climatic benefits, best practices for planting, nurturing, soil preparation, and harvesting.`;
    const result = await getChatbotResponse({ query });

    if (result.success && result.data) {
      setSelectedCropInfo({ crop, details: result.data.answer });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          result.error ||
          'Could not retrieve detailed information for this crop.',
      });
    }

    setIsFetchingDetails(false);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await getLocationFromCoords({ latitude, longitude });
        if (result.success && result.data) {
          form.setValue('location', result.data, { shouldValidate: true });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description:
              result.error || 'Could not determine your location.',
          });
        }
        setIsFetchingLocation(false);
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: `Could not get your location: ${error.message}`,
        });
        setIsFetchingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="e.g., Punjab" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGetLocation}
                      disabled={isFetchingLocation}
                      aria-label="Get current location"
                    >
                      {isFetchingLocation ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Kharif (June-Oct)">
                        Kharif (Jun-Oct)
                      </SelectItem>
                      <SelectItem value="Rabi (Oct-Mar)">
                        Rabi (Oct-Mar)
                      </SelectItem>
                      <SelectItem value="Zaid (Mar-June)">
                        Zaid (Mar-Jun)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="soilType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soil Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a soil type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Alluvial Soil">Alluvial Soil</SelectItem>
                    <SelectItem value="Black Soil">Black Soil</SelectItem>
                    <SelectItem value="Red and Yellow Soil">
                      Red and Yellow Soil
                    </SelectItem>
                    <SelectItem value="Laterite Soil">Laterite Soil</SelectItem>
                    <SelectItem value="Arid Soil">Arid Soil</SelectItem>
                    <SelectItem value="Saline Soil">Saline Soil</SelectItem>
                    <SelectItem value="Peaty Soil">Peaty Soil</SelectItem>
                    <SelectItem value="Forest Soil">Forest Soil</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isPending ? 'Getting Suggestions...' : 'Get Suggestions'}
            <Bot className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>

      {(isPending || hasSearched) && (
        <div className="mt-6">
          <h3 className="font-headline text-lg mb-4">Suggested Crops</h3>
          {isPending ? (
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((crop) => (
                <button
                  key={crop}
                  onClick={() => handleSuggestionClick(crop)}
                  disabled={isFetchingDetails}
                  className="disabled:cursor-not-allowed"
                >
                  <Badge
                    variant="secondary"
                    className="text-base px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Sprout className="mr-2 h-4 w-4" />
                    {crop}
                  </Badge>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No specific crop suggestions found. Try a different location or
              season.
            </p>
          )}
        </div>
      )}

      {isFetchingDetails && (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {selectedCropInfo && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="h-6 w-6 text-primary" />
              Information for {selectedCropInfo.crop}
            </CardTitle>
            <CardDescription>
              Detailed information and growing advice from our AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: selectedCropInfo.details.replace(/\n/g, '<br />'),
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
