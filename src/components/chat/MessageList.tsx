import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./types";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <MessageItem message={message} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};