'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Mic, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type ChatbotProps = {
  onSubmit: (query: string, language: string) => void;
};

const indianLanguages = [
  { value: 'English', label: 'English', langCode: 'en-IN' },
  { value: 'Hindi', label: 'हिंदी (Hindi)', langCode: 'hi-IN' },
  { value: 'Bengali', label: 'বাংলা (Bengali)', langCode: 'bn-IN' },
  { value: 'Telugu', label: 'తెలుగు (Telugu)', langCode: 'te-IN' },
  { value: 'Marathi', label: 'मराठी (Marathi)', langCode: 'mr-IN' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)', langCode: 'ta-IN' },
  { value: 'Urdu', label: 'اردو (Urdu)', langCode: 'ur-IN' },
  { value: 'Gujarati', label: 'ગુજરાતી (Gujarati)', langCode: 'gu-IN' },
  { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)', langCode: 'kn-IN' },
  { value: 'Odia', label: 'ଓଡ଼ିଆ (Odia)', langCode: 'or-IN' },
  { value: 'Malayalam', label: 'മലയാളം (Malayalam)', langCode: 'ml-IN' },
  { value: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', langCode: 'pa-IN' },
  { value: 'Assamese', label: 'অসমীয়া (Assamese)', langCode: 'as-IN' },
];

export function Chatbot({ onSubmit }: ChatbotProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description:
          'Your browser does not support voice recognition. Please try Chrome or Safari.',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      toast({
        variant: 'destructive',
        title: 'Voice Recognition Error',
        description: 'Could not start voice recognition. Please check microphone permissions.',
      });
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(
        (prevInput) =>
          prevInput +
          (finalTranscript.length > 0 ? finalTranscript + ' ' : '')
      );
    };

    recognitionRef.current = recognition;
  }, [toast]);

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const selectedLang = indianLanguages.find(l => l.value === language);
    recognition.lang = selectedLang ? selectedLang.langCode : 'en-IN';

    if (isListening) {
      recognition.stop();
    } else {
      setInput(''); // Clear input before starting new recognition
      recognition.start();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (isListening) {
      recognitionRef.current?.stop();
    }
    onSubmit(input, language);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <p className="text-muted-foreground mb-4">
          Ask me anything about crop selection, planting schedules, pest
          control, or storage techniques. You can also use the microphone to ask your question.
        </p>
        <div className="space-y-2 mb-4">
          <Label htmlFor="language-select">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {indianLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-start space-x-2 pt-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crops, planting, or storage..."
          className="flex-1 resize-none"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          onClick={handleMicClick}
          className={cn(isListening && 'bg-destructive hover:bg-destructive/90 animate-pulse')}
        >
          <Mic className="h-4 w-4" />
          <span className="sr-only">Use Microphone</span>
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="bg-accent hover:bg-accent/90"
        >
          <Send className="h-4 w-4 text-accent-foreground" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}