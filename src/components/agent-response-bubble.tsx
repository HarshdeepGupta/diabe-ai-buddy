
import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageWithExtras } from "@/hooks/use-agent-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

interface AgentResponseBubbleProps {
  message: MessageWithExtras;
  onOptionClick?: (option: string) => void;
}

export const AgentResponseBubble: FC<AgentResponseBubbleProps> = ({ 
  message, 
  onOptionClick 
}) => {
  const formatTime = (date: Date) => {
    return date instanceof Date 
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
      : "";
  };
  
  // Determine bubble style based on message type
  const getBubbleStyle = () => {
    switch (message.type) {
      case "alert":
        return "bg-coral/90 text-white";
      case "check-in":
        return "bg-sunshine/90 text-white";
      case "nudge":
        return "bg-lavender/90 text-white";
      default:
        return "bg-gradient-to-r from-mint to-teal/80 text-white";
    }
  };
  
  return (
    <div className="flex gap-3 max-w-[85%]">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="DiaBuddy" />
        <AvatarFallback className="bg-sunshine text-white">DB</AvatarFallback>
      </Avatar>
      
      <div className={`p-4 rounded-lg ${getBubbleStyle()}`}>
        {message.type === "check-in" && (
          <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">
            Morning Check-In
          </Badge>
        )}
        
        {message.type === "alert" && (
          <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">
            Alert
          </Badge>
        )}
        
        {message.type === "nudge" && (
          <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">
            Health Insight
          </Badge>
        )}
        
        <p className="text-lg">{message.content}</p>
        <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
        
        {/* Options buttons */}
        {message.context?.options && message.context.options.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.context.options.map((option, index) => (
              <Button
                key={index}
                size="sm"
                variant={message.type === "alert" ? "destructive" : "secondary"}
                className="text-sm bg-white/20 hover:bg-white/30 text-white"
                onClick={() => onOptionClick?.(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
        
        {/* Feedback buttons */}
        <div className="mt-3 flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <ThumbsUp className="h-4 w-4" />
            <span className="sr-only">Helpful</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <ThumbsDown className="h-4 w-4" />
            <span className="sr-only">Not Helpful</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
