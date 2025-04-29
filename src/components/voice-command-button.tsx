
import { Button } from "@/components/ui/button";

interface VoiceCommandButtonProps {
  command: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function VoiceCommandButton({ command, onClick, icon }: VoiceCommandButtonProps) {
  return (
    <Button
      variant="outline"
      className="text-base border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-2"
      onClick={onClick}
    >
      {icon}
      "{command}"
    </Button>
  );
}
