
'use client';

import {
  getChatbotResponse,
  getSpeechFromText,
  getChatHistoryAction,
  addChatMessageAction,
  clearChatHistoryAction,
} from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Bot,
  LoaderCircle,
  Mic,
  Send,
  User,
  Volume2,
  Trash2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { indianLanguages } from '@/lib/constants';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function Chatbot() {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const [loading, setLoading] = useState(true); // Start with loading true to fetch history
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [error, setError] = useState('');
  const [isSecureContext, setIsSecureContext] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsSecureContext(window.isSecureContext);
    const fetchHistory = async () => {
      setLoading(true);
      const result = await getChatHistoryAction();
      if (result.success && result.data) {
        setConversation(result.data.map(d => ({ role: d.role, content: d.content })));
      } else if (result.error) {
        toast({
            variant: 'destructive',
            title: 'Error loading history',
            description: result.error
        });
      }
      setLoading(false);
    };
    fetchHistory();
  }, [toast]);

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

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      toast({
        variant: 'destructive',
        title: 'Voice Recognition Error',
        description:
          'Could not start voice recognition. Please check microphone permissions and ensure you are on a secure (HTTPS) connection.',
      });
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setInput((prevInput) => prevInput + finalTranscript);
    };

    recognitionRef.current = recognition;
  }, [toast]);

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!isSecureContext) {
      toast({
        variant: 'destructive',
        title: 'Insecure Connection',
        description:
          'Microphone access is disabled on insecure connections. Please use HTTPS.',
      });
      return;
    }

    const selectedLang = indianLanguages.find((l) => l.value === language);
    recognition.lang = selectedLang ? selectedLang.langCode : 'en-IN';

    if (isListening) {
      recognition.stop();
    } else {
      setInput(''); // Clear input before starting new recognition
      recognition.start();
    }
  };

  const playAudio = async (text: string) => {
    setIsGeneratingAudio(true);
    setAudioUrl(null);
    const result = await getSpeechFromText(text);
    if (result.success && result.data) {
      setAudioUrl(result.data.media);
    } else {
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: result.error || 'Failed to generate audio.',
      });
    }
    setIsGeneratingAudio(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const fromVoice = isListening;
    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMessage: ChatMessage = { role: 'user', content: input };
    setConversation((prev) => [...prev, userMessage]);
    setLoading(true);
    setError('');
    setAudioUrl(null);
    
    // Save user message to DB, but don't block UI
    addChatMessageAction(userMessage).catch(err => console.error("Failed to save user message", err));
    const currentInput = input;
    setInput('');


    const result = await getChatbotResponse({
      query: currentInput,
      language: language || 'English',
    });

    if (result.success && result.data) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.data.answer,
      };
      setConversation((prev) => [...prev, assistantMessage]);
      addChatMessageAction(assistantMessage).catch(err => console.error("Failed to save assistant message", err));

      if (fromVoice) {
        await playAudio(result.data.answer);
      }
    } else {
      setError(
        result.error || 'An unexpected error occurred. Please try again later.'
      );
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          result.error || 'Failed to get a response from the AI assistant.',
      });
      // Remove the user message from UI if AI fails
      setConversation(prev => prev.slice(0, -1));
    }
    setLoading(false);
  };

  const handlePlayLastResponse = async () => {
    const lastMessage = conversation.findLast((m) => m.role === 'assistant');
    if (!lastMessage) return;

    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      return;
    }
    await playAudio(lastMessage.content);
  };

  const handleClearHistory = async () => {
    setConversation([]);
    const result = await clearChatHistoryAction();
     if (result.success) {
      toast({
        title: 'Chat history cleared',
      });
    } else {
        toast({
            variant: 'destructive',
            title: "Error",
            description: result.error
        })
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  const micButton = (
    <Button
      type="button"
      size="icon"
      onClick={handleMicClick}
      className={cn(
        isListening && 'bg-destructive hover:bg-destructive/90 animate-pulse'
      )}
      disabled={!isSecureContext}
    >
      <Mic className="h-4 w-4" />
      <span className="sr-only">Use Microphone</span>
    </Button>
  );

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-grow space-y-6 overflow-y-auto p-1 mb-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={cn(
              'flex gap-3',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'assistant' && (
              <Bot className="h-6 w-6 text-primary flex-shrink-0" />
            )}
            <div
              className={cn(
                'p-4 rounded-lg max-w-lg',
                msg.role === 'user' ? 'bg-muted' : 'bg-background border'
              )}
            >
              <div
                className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\n/g, '<br />'),
                }}
              />
            </div>
            {msg.role === 'user' && (
              <User className="h-6 w-6 text-primary flex-shrink-0" />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <Bot className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="p-4 rounded-lg max-w-lg bg-background border">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Ask anything about farming.
          </p>
          <div className="flex items-center gap-2">
            {!loading && conversation.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleClearHistory}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Clear Chat History</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Chat History</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {!loading && conversation.some((m) => m.role === 'assistant') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handlePlayLastResponse}
                      variant="ghost"
                      size="icon"
                      disabled={isGeneratingAudio}
                    >
                      {isGeneratingAudio ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                      <span className="sr-only">Play Last Response</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Play Last Response</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Label htmlFor="language-select">Response Language</Label>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{micButton}</span>
              </TooltipTrigger>
              {!isSecureContext && (
                <TooltipContent>
                  <p>Microphone requires a secure (HTTPS) connection.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || loading}
            className="bg-accent hover:bg-accent/90"
          >
            <Send className="h-4 w-4 text-accent-foreground" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} className="hidden" autoPlay />
        )}
      </div>
    </div>
  );
}