import { useRagChat } from "@/hooks/useRagChat";
import React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Heart,
  Mic,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  PauseCircle,
  Pill,
  Utensils,
  HelpCircle,
  UserCircle,
  Share2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { VoiceWaveform } from "@/components/voice-waveform"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type AIPersonality = "supportive" | "coaching" | "clinical" | "friendly"

export default function VoiceChatPage() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") as "glucose" | "medication" | "meal" | "wellness" | undefined;
  
  // Use the RAG chat hook with voice support
  const {
    messages,
    isLoading,
    followupQuestions,
    sendMessage,
    addSystemMessage,
    isRecording,
    isProcessingVoice,
    isSpeaking,
    startRecording,
    stopRecording,
  } = useRagChat({ topic, initialMessages: [] });

  const [input, setInput] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [personality, setPersonality] = useState<AIPersonality>("supportive")
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false)
  const [caregiverNotify, setCaregiverNotify] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [showPersonalitySettings, setShowPersonalitySettings] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)

  // Initialize with welcome message based on topic
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Morning check-in when no topic
    if (!topic) {
      const checkInMessage = "Good morning, Martha! It's time for your morning check-in. Would you like to log your blood sugar now?";
      addSystemMessage(checkInMessage, "check-in");
      return;
    }

    // Topic-based greeting
    let greetingMessage = "Hello Martha! I'm your DiaVoice assistant. How can I help you today with your diabetes management?";
    if (topic === "glucose") greetingMessage = "Let's talk about blood sugar. What questions do you have?";
    else if (topic === "medication") greetingMessage = "I am your medicine expert, what do you want to know?";
    else if (topic === "meal") greetingMessage = "Let's discuss your meal options.";
    else if (topic === "wellness") greetingMessage = "How are you feeling today, Martha? I'm here to listen and support you.";

    // Send initial greeting
    setTimeout(() => addSystemMessage(greetingMessage, "text"), 100);
  }, [topic, addSystemMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Send message handler
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  }

  // Voice button handler using hook
  const handleVoiceButtonClick = () => {
    if (!isRecording) startRecording();
    else stopRecording();
  }

  // Button appearance based on voice states
  const getVoiceButtonAppearance = () => {
    if (isRecording) {
      return { icon: <Mic className="h-6 w-6" />, color: "bg-coral hover:bg-coral/90", label: "Recording..." };
    }
    if (isProcessingVoice) {
      return { icon: <Sparkles className="h-6 w-6" />, color: "bg-lavender hover:bg-lavender/90", label: "Processing..." };
    }
    if (isSpeaking) {
      return { icon: <PauseCircle className="h-6 w-6" />, color: "bg-teal hover:bg-teal/90", label: "Speaking..." };
    }
    return { icon: <Mic className="h-6 w-6" />, color: "bg-primary hover:bg-primary/90", label: "Start Speaking" };
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleEmergencyAction = (action: string) => {
    if (action === "call-emergency") {
      // In a real app, this would initiate an emergency call
      alert("Initiating emergency call...")
    } else if (action === "notify-caregiver") {
      setCaregiverNotify(true)
      // In a real app, this would send a notification to the caregiver
      alert("Notifying your emergency contact...")
    }
    setIsEmergencyDialogOpen(false)
  }

  const handleQuickCommand = (command: string) => {
    const commandMap = {
      "Medication": "Tell me about my medication schedule today",
      "Health": "How are my health metrics looking this week?",
      "Diet": "What should I eat for my next meal?",
      "Help": "I need help managing my diabetes"
    };
    
    const message = commandMap[command as keyof typeof commandMap] || command;
    sendMessage(message);
  }

  const buttonAppearance = getVoiceButtonAppearance()

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl h-screen flex flex-col welcome-pattern">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">DiaVoice Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-2">
            <TabsList className="h-10">
              <TabsTrigger value="chat" className="text-base">
                Chat
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-base">
                Insights
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setShowPersonalitySettings(!showPersonalitySettings)}
          >
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">Assistant Personality</span>
          </Button>
        </div>
      </header>

      {showPersonalitySettings && (
        <Card className="mb-4 border-2 border-muted">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Assistant Personality</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={personality === "supportive" ? "default" : "outline"}
                className="text-base"
                onClick={() => setPersonality("supportive")}
              >
                Supportive
              </Button>
              <Button
                variant={personality === "coaching" ? "default" : "outline"}
                className="text-base"
                onClick={() => setPersonality("coaching")}
              >
                Coaching
              </Button>
              <Button
                variant={personality === "clinical" ? "default" : "outline"}
                className="text-base"
                onClick={() => setPersonality("clinical")}
              >
                Clinical
              </Button>
              <Button
                variant={personality === "friendly" ? "default" : "outline"}
                className="text-base"
                onClick={() => setPersonality("friendly")}
              >
                Friendly
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "chat" ? (
        <>
          <ScrollArea className="flex-1 p-4 mb-4 border rounded-lg bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-3 max-w-[85%]">
                    {message.role !== "user" && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="DiaVoice" />
                        <AvatarFallback className="bg-sunshine text-white">DV</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-4 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : message.type === "alert"
                            ? "bg-coral/90 text-white"
                            : message.type === "check-in"
                              ? "bg-sunshine/90 text-white"
                              : message.type === "nudge"
                                ? "bg-lavender/90 text-white"
                                : "bg-gradient-to-r from-mint to-teal/80 text-white"
                      }`}
                    >
                      {message.type === "check-in" && (
                        <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">Morning Check-In</Badge>
                      )}
                      {message.type === "alert" && (
                        <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">Alert</Badge>
                      )}
                      {message.type === "nudge" && (
                        <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">Health Insight</Badge>
                      )}
                      {message.type === "voice" && message.role === "user" && (
                        <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
                          <Mic className="h-3 w-3" /> Voice message
                        </div>
                      )}
                      <p className="text-lg">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>

                      {message.context?.options && message.context.options.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.context.options.map((option, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant={message.type === "alert" ? "destructive" : "secondary"}
                              className="text-sm bg-white/20 hover:bg-white/30 text-white"
                              onClick={() => sendMessage(option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}

                      {message.role === "assistant" && (
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
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback className="bg-coral text-white">MJ</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="DiaVoice" />
                      <AvatarFallback className="bg-sunshine text-white">DV</AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-mint to-teal/80 text-white">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                        <p className="text-lg">Thinking...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Voice Waveform Visualization */}
          {(isRecording || isSpeaking) && (
            <div className="mb-4 p-4 bg-white/80 rounded-lg border flex items-center justify-center">
              <VoiceWaveform isActive={true} type={isRecording ? "listening" : "speaking"} />
              <p className="ml-4 text-lg font-medium text-primary">{buttonAppearance.label}</p>
            </div>
          )}

          {/* Quick Commands */}
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            <QuickCommandButton icon={<Pill />} label="Medication" onClick={() => handleQuickCommand("Medication")} />
            <QuickCommandButton icon={<Heart />} label="Health" onClick={() => handleQuickCommand("Health")} />
            <QuickCommandButton icon={<Utensils />} label="Diet" onClick={() => handleQuickCommand("Diet")} />
            <QuickCommandButton icon={<HelpCircle />} label="Help" onClick={() => handleQuickCommand("Help")} />
          </div>

          <div className="flex gap-2 items-center">
            <Button onClick={handleVoiceButtonClick} size="icon" className={`h-12 w-12 ${buttonAppearance.color}`}>  
              {buttonAppearance.icon}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="text-lg p-6 bg-white/80"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon" 
              className="h-12 w-12 bg-sunshine hover:bg-sunshine/90"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 space-y-4">
          <Card className="border-2 border-muted">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Weekly Health Insights</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">Blood Sugar Patterns</h4>
                  <p className="text-muted-foreground mb-2">
                    Your evening readings have been trending higher this week. This pattern often relates to dinner
                    choices.
                  </p>
                  <Button variant="outline" className="text-base">
                    View Detailed Analysis
                  </Button>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">Medication Adherence</h4>
                  <p className="text-muted-foreground mb-2">
                    You've taken 95% of your medications on time this week. Great job staying consistent!
                  </p>
                  <Button variant="outline" className="text-base">
                    View Medication History
                  </Button>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">Mood Tracking</h4>
                  <p className="text-muted-foreground mb-2">
                    You've reported feeling tired more frequently in the afternoons. This might be related to your
                    post-lunch glucose levels.
                  </p>
                  <Button variant="outline" className="text-base">
                    View Mood Journal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Emergency Dialog */}
      <Dialog open={isEmergencyDialogOpen} onOpenChange={setIsEmergencyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-coral flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Emergency Assistance
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg mb-4">
              It sounds like you might need immediate assistance. How can I help you right now?
            </p>
            <div className="space-y-3">
              <Button
                className="w-full text-lg bg-coral hover:bg-coral/90"
                onClick={() => handleEmergencyAction("call-emergency")}
              >
                Call Emergency Services (911)
              </Button>
              <Button className="w-full text-lg" onClick={() => handleEmergencyAction("notify-caregiver")}>
                Notify Sarah (Emergency Contact)
              </Button>
              <Button variant="outline" className="w-full text-lg" onClick={() => setIsEmergencyDialogOpen(false)}>
                I'm OK, Cancel
              </Button>
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center gap-2 w-full">
              <Switch id="caregiver-notify" checked={caregiverNotify} onCheckedChange={setCaregiverNotify} />
              <Label htmlFor="caregiver-notify">Always notify caregiver during emergencies</Label>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface QuickCommandButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickCommandButton({ icon, label, onClick }: QuickCommandButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="text-base border-primary/30 text-primary hover:bg-primary/10"
      onClick={onClick}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 mr-2" })}
      {label}
    </Button>
  )
}