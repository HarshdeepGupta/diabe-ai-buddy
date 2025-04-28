

import { Button } from "@/components/ui/button"

interface VoiceCommandButtonProps {
  command: string
  onClick?: () => void
}

export function VoiceCommandButton({ command, onClick }: VoiceCommandButtonProps) {
  return (
    <Button
      variant="outline"
      className="text-base border-primary/30 text-primary hover:bg-primary/10"
      onClick={onClick}
    >
      "{command}"
    </Button>
  )
}
