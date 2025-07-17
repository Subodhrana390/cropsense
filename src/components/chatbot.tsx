
'use client';

import { getChatbotResponse } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useTransition,
} from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

export type ChatbotRef = {
  submitQuery: (query: string) => void;
};

const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <span className="sr-only">Typing...</span>
    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
  </div>
);

export const Chatbot = forwardRef<ChatbotRef, {}>((props, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you with your farming questions today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleQuerySubmit = (query: string) => {
    if (!query.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: <TypingIndicator />,
      },
    ]);
    setInput('');

    startTransition(async () => {
      const result = await getChatbotResponse({ query: query });

      if (result.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: result.data }
              : msg
          )
        );
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId)
        );
      }
    });
  };

  useImperativeHandle(ref, () => ({
    submitQuery: (query: string) => {
      handleQuerySubmit(query);
    },
  }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleQuerySubmit(input);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4 -m-4" ref={scrollAreaRef}>
        <div className="space-y-4 pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.content}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-start space-x-2 pt-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crops, planting, or storage..."
          className="flex-1 resize-none"
          rows={1}
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
          disabled={isPending || !input.trim()}
          className="bg-accent hover:bg-accent/90"
        >
          <Send className="h-4 w-4 text-accent-foreground" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
});
Chatbot.displayName = 'Chatbot';
