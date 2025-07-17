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
import { Send } from 'lucide-react';
import { useState } from 'react';

type ChatbotProps = {
  onSubmit: (query: string, language: string) => void;
};

const indianLanguages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी (Hindi)' },
  { value: 'Bengali', label: 'বাংলা (Bengali)' },
  { value: 'Telugu', label: 'తెలుగు (Telugu)' },
  { value: 'Marathi', label: 'मराठी (Marathi)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
  { value: 'Urdu', label: 'اردو (Urdu)' },
  { value: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
  { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'Odia', label: 'ଓଡ଼ିଆ (Odia)' },
  { value: 'Malayalam', label: 'മലയാളം (Malayalam)' },
  { value: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'Assamese', label: 'অসমীয়া (Assamese)' },
];

export function Chatbot({ onSubmit }: ChatbotProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input, language);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <p className="text-muted-foreground mb-4">
          Ask me anything about crop selection, planting schedules, pest
          control, or storage techniques. I'm here to help you make informed
          decisions for your farm.
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
