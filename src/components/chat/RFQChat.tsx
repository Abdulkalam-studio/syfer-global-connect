import { useState, useRef, useEffect } from 'react';
import { Send, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDataStore } from '@/store/dataStore';
import { generateId } from '@/lib/validation';
import { cn } from '@/lib/utils';

interface RFQChatProps {
  rfqId: string;
  userRole: 'user' | 'admin';
}

export const RFQChat = ({ rfqId, userRole }: RFQChatProps) => {
  const { messages, addMessage } = useDataStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rfqMessages = messages
    .filter((m) => m.rfqId === rfqId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rfqMessages.length]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    addMessage({
      id: generateId(),
      rfqId,
      from: userRole,
      text: newMessage.trim(),
      createdAt: new Date(),
    });
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[400px] bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/50">
        <h4 className="font-medium text-foreground">Chat History</h4>
        <p className="text-xs text-muted-foreground">{rfqMessages.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {rfqMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          rfqMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.from === userRole ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  msg.from === 'admin' ? 'bg-primary/10' : 'bg-muted'
                )}
              >
                {msg.from === 'admin' ? (
                  <Shield className="w-4 h-4 text-primary" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[70%] rounded-lg px-4 py-2',
                  msg.from === userRole
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={cn(
                    'text-xs mt-1',
                    msg.from === userRole ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} variant="gold" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
