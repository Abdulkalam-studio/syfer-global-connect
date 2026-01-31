import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRFQMessages } from '@/hooks/useRFQs';
import { useAuthContext } from '@/contexts/AuthContext';
import { RFQ } from '@/types/database';
import { cn } from '@/lib/utils';

interface RFQChatPanelProps {
  rfq: RFQ;
  senderType: 'admin' | 'user';
}

export const RFQChatPanel = ({ rfq, senderType }: RFQChatPanelProps) => {
  const { user } = useAuthContext();
  const { messages, isLoading, sendMessage } = useRFQMessages(rfq.id);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    setIsSending(true);
    await sendMessage.mutateAsync({
      rfq_id: rfq.id,
      sender_type: senderType,
      sender_id: user.id,
      text: newMessage.trim(),
    });
    setNewMessage('');
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      {/* RFQ Details */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Quantity:</span>
            <span className="ml-2 text-foreground font-medium">{rfq.quantity}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <span
              className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
                rfq.status === 'Pending' && 'bg-yellow-500/20 text-yellow-600',
                rfq.status === 'In Discussion' && 'bg-blue-500/20 text-blue-600',
                rfq.status === 'Closed' && 'bg-green-500/20 text-green-600'
              )}
            >
              {rfq.status}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Target Price:</span>
            <span className="ml-2 text-foreground">{rfq.target_price || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Country:</span>
            <span className="ml-2 text-foreground">{rfq.country}</span>
          </div>
        </div>
        {rfq.message && (
          <div className="mt-2">
            <span className="text-muted-foreground text-sm">Message:</span>
            <p className="text-sm text-foreground mt-1">{rfq.message}</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.sender_type === senderType ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[70%] rounded-lg px-4 py-2',
                  message.sender_type === senderType
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={cn(
                    'text-xs mt-1',
                    message.sender_type === senderType
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  )}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <Button onClick={handleSend} disabled={isSending || !newMessage.trim()}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
