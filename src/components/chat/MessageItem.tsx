import { Message } from "./types";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const renderContent = () => {
    return message.content.split('\n').map((line, i) => {
      // Check if line contains a social link
      if (line.includes('://')) {
        const [prefix, url] = line.split(': ');
        if (url) {
          return (
            <a 
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline block"
            >
              {line}
            </a>
          );
        }
      }
      return <div key={i}>{line}</div>;
    });
  };

  return (
    <div 
      className={`max-w-[80%] rounded-lg p-3 ${
        message.type === 'user'
          ? 'bg-primary text-primary-foreground ml-4'
          : 'bg-muted text-foreground mr-4'
      }`}
    >
      {renderContent()}
    </div>
  );
};