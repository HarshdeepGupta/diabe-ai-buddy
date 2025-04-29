
import { FC } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentThinkingProps {
  message?: string;
  className?: string;
}

export const AgentThinking: FC<AgentThinkingProps> = ({ 
  message = "Thinking...", 
  className 
}) => {
  return (
    <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  );
};
