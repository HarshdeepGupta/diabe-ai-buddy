import React from "react"
import { useState, useRef, useEffect } from "react"
import { Link,useSearchParams } from 'react-router-dom';
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

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  type: "text" | "voice" | "check-in" | "alert" | "nudge"
  context?: {
    category?: "medication" | "glucose" | "meal" | "activity" | "mood" | "emergency"
    actionable?: boolean
    options?: string[]
    mood?: "neutral" | "concerned" | "encouraging" | "urgent" | "supportive" | "coaching"
    relatedData?: any
  }
}

type VoiceState = "idle" | "listening" | "processing" | "speaking"
type AIPersonality = "supportive" | "coaching" | "clinical" | "friendly"

export default function VoiceChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const topic = searchParams.get("topic") || ""

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [personality, setPersonality] = useState<AIPersonality>("supportive")
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false)
  const [caregiverNotify, setCaregiverNotify] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [showPersonalitySettings, setShowPersonalitySettings] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const waveformInterval = useRef<NodeJS.Timeout | null>(null)

  // Initialize with welcome message based on topic
  useEffect(() => {
    const initialMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: "Hello Martha! I'm your DiaVoice assistant. How can I help you today with your diabetes management?",
      timestamp: new Date(),
      type: "text",
    }

    // Customize initial message based on topic
    if (topic === "glucose") {
      initialMessage.content =
        "Let's talk about your blood sugar. Would you like to log a new reading or review your recent trends?"
      initialMessage.context = { category: "glucose", actionable: true }
    } else if (topic === "medications") {
      initialMessage.content =
        "I see you have a medication due in 30 minutes. Would you like me to remind you about your medications today?"
      initialMessage.context = { category: "medication", actionable: true }
    } else if (topic === "meals") {
      initialMessage.content =
        "Let's discuss your meal options. I noticed that oatmeal with banana spiked your sugar last Tuesday. Would you like some alternative breakfast suggestions?"
      initialMessage.context = { category: "meal", actionable: true }
    } else if (topic === "wellness") {
      initialMessage.content = "How are you feeling today, Martha? I'm here to listen and support you."
      initialMessage.context = { category: "mood", actionable: false }
    }

    // Add a morning check-in message if no specific topic
    if (!topic) {
      const checkInMessage: Message = {
        id: "check-in",
        role: "system",
        content:
          "Good morning, Martha! It's time for your morning check-in. Would you like to log your blood sugar now?",
        timestamp: new Date(),
        type: "check-in",
        context: {
          category: "glucose",
          actionable: true,
          options: ["Yes, let's log it", "Remind me later", "I already checked it"],
          mood: "encouraging",
        },
      }
      setMessages([checkInMessage, initialMessage])
    } else {
      setMessages([initialMessage])
    }
  }, [topic])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    simulateResponse(input)
  }

  const handleVoiceButtonClick = () => {
    if (voiceState === "idle") {
      startListening()
    } else if (voiceState === "listening") {
      stopListening()
    } else if (voiceState === "speaking") {
      stopSpeaking()
    }
  }

  const startListening = () => {
    setVoiceState("listening")

    // Simulate voice recognition after 3 seconds
    setTimeout(() => {
      const recognizedText = getRandomUserQuery()

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: recognizedText,
        timestamp: new Date(),
        type: "voice",
      }

      setMessages((prev) => [...prev, userMessage])
      setVoiceState("processing")

      // Simulate processing
      setTimeout(() => {
        simulateResponse(recognizedText)
      }, 1000)
    }, 3000)
  }

  const stopListening = () => {
    setVoiceState("idle")
  }

  const stopSpeaking = () => {
    setVoiceState("idle")
  }

  const simulateResponse = (query: string) => {
    setTimeout(() => {
      const response: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        type: "text",
      }

      // Check for emergency keywords
      if (
        query.toLowerCase().includes("emergency") ||
        query.toLowerCase().includes("help") ||
        query.toLowerCase().includes("pain") ||
        query.toLowerCase().includes("dizzy")
      ) {
        response.content = "I notice you may be experiencing an urgent situation. Are you having a medical emergency?"
        response.type = "alert"
        response.context = {
          category: "emergency",
          actionable: true,
          options: ["Yes, I need help", "No, I'm okay"],
          mood: "urgent",
        }

        // Open emergency dialog
        setIsEmergencyDialogOpen(true)
      }
      // Check for glucose related queries
      else if (
        query.toLowerCase().includes("glucose") ||
        query.toLowerCase().includes("sugar") ||
        query.toLowerCase().includes("reading")
      ) {
        response.content =
          "Your last blood glucose reading was 120 mg/dL at 7:30 AM, which is within your target range. Would you like to log a new reading now?"
        response.context = {
          category: "glucose",
          actionable: true,
          options: ["Log new reading", "Show me my trends", "No thanks"],
          mood: "encouraging",
          relatedData: {
            lastReading: 120,
            lastReadingTime: "7:30 AM",
            trend: "stable",
          },
        }
      }
      // Check for medication related queries
      else if (
        query.toLowerCase().includes("medicine") ||
        query.toLowerCase().includes("medication") ||
        query.toLowerCase().includes("pill")
      ) {
        response.content =
          "You have Metformin 500mg due at 9:00 AM with breakfast. Would you like me to mark it as taken or remind you later?"
        response.context = {
          category: "medication",
          actionable: true,
          options: ["Mark as taken", "Remind me later", "Tell me more about this medication"],
          mood: "neutral",
        }
      }
      // Check for meal related queries
      else if (
        query.toLowerCase().includes("food") ||
        query.toLowerCase().includes("eat") ||
        query.toLowerCase().includes("diet") ||
        query.toLowerCase().includes("meal")
      ) {
        response.content =
          "Based on your glucose patterns, I've noticed that high-carb breakfasts tend to spike your sugar levels. Would you like some low-glycemic breakfast options that have worked well for you in the past?"
        response.type = "nudge"
        response.context = {
          category: "meal",
          actionable: true,
          options: ["Show me options", "Tell me more about glycemic index", "Not now"],
          mood: "encouraging", // Changed from "coaching" to "encouraging"
        }
      }
      // Check for mood/emotional queries
      else if (
        query.toLowerCase().includes("tired") ||
        query.toLowerCase().includes("frustrated") ||
        query.toLowerCase().includes("sad") ||
        query.toLowerCase().includes("feel")
      ) {
        response.content =
          "I hear that you're feeling frustrated. Living with diabetes can be challenging sometimes. Would you like to talk more about what's bothering you, or would some relaxation techniques help?"
        response.context = {
          category: "mood",
          actionable: true,
          options: ["Let's talk more", "Suggest relaxation techniques", "Contact my support person"],
          mood: "concerned", // Changed from "supportive" to "concerned"
        }
      }
      // Check for status/progress queries
      else if (
        query.toLowerCase().includes("how am i") ||
        query.toLowerCase().includes("my health") ||
        query.toLowerCase().includes("doing") ||
        query.toLowerCase().includes("progress")
      ) {
        response.content =
          "You're doing well this week, Martha! Your glucose readings have been stable, and you've taken all your medications on time. You've also completed 80% of your activity goals. There's just one pattern I've noticed - your evening readings tend to be a bit higher. Would you like to discuss strategies for your evening routine?"
        response.type = "nudge"
        response.context = {
          category: "glucose",
          actionable: true,
          options: ["Tell me more about evening readings", "What should I change?", "Show me my weekly report"],
          mood: "encouraging", // Changed from "coaching" to "encouraging"
        }
      }
      // Default response
      else {
        response.content =
          "Thank you for sharing that. Managing diabetes is a journey, and I'm here to support you every step of the way. Is there anything specific about your diabetes management you'd like to focus on today?"
        response.context = {
          options: ["Blood sugar", "Medications", "Meals", "How I'm feeling"],
          mood: "neutral", // Changed from "supportive" to "neutral"
        }
      }

      setMessages((prev) => [...prev, response])

      if (!isMuted) {
        setVoiceState("speaking")

        // Simulate speech duration based on response length
        const speakingDuration = Math.min(response.content.length * 50, 5000)
        setTimeout(() => {
          setVoiceState("idle")
        }, speakingDuration)
      }
    }, 1000)
  }

  const getRandomUserQuery = () => {
    const queries = [
      "What should I eat for breakfast?",
      "How am I doing today?",
      "When should I take my medication?",
      "What's my blood sugar level?",
      "Can you recommend some exercises?",
      "I'm feeling tired today",
      "Set a reminder for my doctor's appointment",
    ]
    return queries[Math.floor(Math.random() * queries.length)]
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

  const getVoiceButtonAppearance = () => {
    switch (voiceState) {
      case "listening":
        return {
          icon: <Mic className="h-6 w-6" />,
          color: "bg-coral hover:bg-coral/90",
          label: "Listening...",
        }
      case "processing":
        return {
          icon: <Sparkles className="h-6 w-6" />,
          color: "bg-lavender hover:bg-lavender/90",
          label: "Processing...",
        }
      case "speaking":
        return {
          icon: <PauseCircle className="h-6 w-6" />,
          color: "bg-teal hover:bg-teal/90",
          label: "Speaking...",
        }
      default:
        return {
          icon: <Mic className="h-6 w-6" />,
          color: "bg-primary hover:bg-primary/90",
          label: "Start Speaking",
        }
    }
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
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Voice Waveform Visualization */}
          {voiceState !== "idle" && (
            <div className="mb-4 p-4 bg-white/80 rounded-lg border flex items-center justify-center">
              <VoiceWaveform isActive={true} type={voiceState === "listening" ? "listening" : "speaking"} />
              <p className="ml-4 text-lg font-medium text-primary">{buttonAppearance.label}</p>
            </div>
          )}

          {/* Quick Commands */}
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            <QuickCommandButton icon={<Pill />} label="Medication" />
            <QuickCommandButton icon={<Heart />} label="Health" />
            <QuickCommandButton icon={<Utensils />} label="Diet" />
            <QuickCommandButton icon={<HelpCircle />} label="Help" />
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
            />
            <Button onClick={handleSendMessage} size="icon" className="h-12 w-12 bg-sunshine hover:bg-sunshine/90">
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

function QuickCommandButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button variant="outline" className="text-base border-primary/30 text-primary hover:bg-primary/10">
      {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 mr-2" })}
      {label}
    </Button>
  )
}
