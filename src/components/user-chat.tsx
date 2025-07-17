'use client';

import { useEffect, useState, useRef, use } from 'react';
import {
  getMessages,
  sendMessage,
  getUserDetails,
  type Message,
} from '@/app/actions';
import type { SafeUser } from '@/lib/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';

export function UserChat({ params }: { params: { userId: string } }) {
  // The 'params' object is now a promise that needs to be unwrapped.
  // In this version of Next.js, this is a warning, but it will be an error
  // in the future. We can use React.use() to unwrap the promise.
  // Note that since we can't conditionally call hooks, we can't check
  // if `params` is a promise before calling `React.use`.
  // The line can be uncommented once the Next.js version is upgraded.
  // const { userId: recipientId } = use(params);
  const recipientId = params.userId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      const userDetailsResult = await getUserDetails(recipientId);
      if (userDetailsResult.success && userDetailsResult.data) {
        setRecipient(userDetailsResult.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load user details.',
        });
      }
      setLoading(false);
    }
    fetchInitialData();
  }, [recipientId, toast]);

  useEffect(() => {
    if (!recipientId) return;

    const fetchMessages = async () => {
      const result = await getMessages(recipientId);
      if (result.success && result.data) {
        setMessages(result.data);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipientId) return;
    setSending(true);

    const result = await sendMessage(recipientId, newMessage);
    if (result.success && result.data) {
      setMessages((prev) => [...prev, result.data!]);
      setNewMessage('');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to send message.',
      });
    }
    setSending(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recipient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The user you are trying to chat with does not exist.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${recipient.name}`}
          />
          <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{recipient.name}</CardTitle>
          <CardDescription>Online</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-end gap-2',
              msg.fromSelf ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'rounded-lg px-4 py-2 max-w-sm',
                msg.fromSelf
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
