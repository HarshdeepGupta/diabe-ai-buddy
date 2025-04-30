
import { FC } from "react";
import { MessageWithExtras } from "@/hooks/use-agent-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic } from "lucide-react";

interface UserMessageBubbleProps {
  message: MessageWithExtras;
}

export const UserMessageBubble: FC<UserMessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date instanceof Date 
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
      : "";
  };
  
  return (
    <div className="flex justify-end">
      <div className="flex gap-3 max-w-[80%]">
        <div className="p-4 rounded-lg bg-primary text-primary-foreground">
          {message.type === "voice" && (
            <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
              <Mic className="h-3 w-3" /> Voice message
            </div>
          )}
          <p className="text-lg">{message.content}</p>
          <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback className="bg-coral text-white">MJ</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
