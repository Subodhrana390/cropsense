'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useState } from 'react';

type ChatbotProps = {
  onSubmit: (query: string) => void;
};

export function Chatbot({ onSubmit }: ChatbotProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <p className="text-muted-foreground mb-4">
        Ask me anything about crop selection, planting schedules, pest control,
        or storage techniques. I'm here to help you make informed decisions for
        your farm.
      </p>
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
