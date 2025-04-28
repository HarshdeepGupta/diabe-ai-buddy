

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Plus, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type Action = {
  type: "reminder" | "calendar" | "motivation"
  title: string
  description?: string
  date?: Date
  time?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello Martha! I'm your DiaBuddy assistant. How can I help you today? You can ask me about diabetes management, diet recommendations, exercise tips, or just chat if you need some support.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
  const [reminderTitle, setReminderTitle] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("")
  const [actions, setActions] = useState<Action[]>([
    {
      type: "reminder",
      title: "Take Metformin",
      date: new Date(),
      time: "8:00 AM",
    },
    {
      type: "calendar",
      title: "Doctor's Appointment",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      time: "10:30 AM",
    },
    {
      type: "motivation",
      title: "Daily Walk",
      description: "A 15-minute walk after meals can help lower blood sugar levels.",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (
        input.toLowerCase().includes("food") ||
        input.toLowerCase().includes("eat") ||
        input.toLowerCase().includes("diet")
      ) {
        response =
          "For diabetes management, focus on foods with a low glycemic index. Good choices include non-starchy vegetables, whole grains, lean proteins, and healthy fats. Would you like me to suggest a meal plan based on your preferences?"
      } else if (input.toLowerCase().includes("exercise") || input.toLowerCase().includes("activity")) {
        response =
          "Regular physical activity is important for managing diabetes. Aim for 150 minutes of moderate exercise per week. Walking, swimming, and cycling are excellent options. Would you like me to help you create an exercise schedule?"
      } else if (input.toLowerCase().includes("medicine") || input.toLowerCase().includes("medication")) {
        response =
          "It's important to take your medications as prescribed. Metformin helps your body respond better to insulin. Would you like me to set a reminder for your medications?"
      } else if (
        input.toLowerCase().includes("tired") ||
        input.toLowerCase().includes("frustrated") ||
        input.toLowerCase().includes("hard")
      ) {
        response =
          "Living with diabetes can be challenging sometimes. It's okay to feel frustrated. Remember that small steps lead to big changes, and you're doing a great job managing your health. Would you like to talk more about what's bothering you?"
      } else {
        response =
          "Thank you for sharing that. Managing diabetes is a journey, and I'm here to support you every step of the way. Is there anything specific about diabetes management you'd like to know more about?"
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const addReminder = () => {
    if (reminderTitle.trim() === "") return

    const newReminder: Action = {
      type: "reminder",
      title: reminderTitle,
      date: reminderDate ? new Date(reminderDate) : new Date(),
      time: reminderTime || "12:00 PM",
    }

    setActions((prev) => [newReminder, ...prev])
    setReminderTitle("")
    setReminderDate("")
    setReminderTime("")
    setIsReminderDialogOpen(false)

    // Add confirmation message to chat
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: `I've added a reminder for "${reminderTitle}" on ${new Date(reminderDate).toLocaleDateString()} at ${reminderTime}.`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

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
          <h1 className="text-3xl font-bold text-primary">DiaBuddy Chat</h1>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="chat" className="text-lg">
              Chat
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-lg">
              Actions
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {activeTab === "chat" ? (
        <>
          <ScrollArea className="flex-1 p-4 mb-4 border rounded-lg bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-3 max-w-[80%]">
                    {message.role === "assistant" && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="DiaBuddy" />
                        <AvatarFallback className="bg-sunshine text-white">DB</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-4 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-to-r from-mint to-teal/80 text-white"
                      }`}
                    >
                      <p className="text-lg">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
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

          <div className="flex gap-2 items-center">
            <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-primary text-primary hover:bg-primary/10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl text-primary">Add Reminder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-title" className="text-lg">
                      Reminder
                    </Label>
                    <Input
                      id="reminder-title"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className="text-lg p-6"
                      placeholder="What do you want to be reminded about?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminder-date" className="text-lg">
                        Date
                      </Label>
                      <Input
                        id="reminder-date"
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="text-lg p-6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-time" className="text-lg">
                        Time
                      </Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="text-lg p-6"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={addReminder} className="text-lg">
                    Add Reminder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-primary">Your Actions</h2>
            <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg gap-2 bg-sunshine hover:bg-sunshine/90">
                  <Plus className="h-5 w-5" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl text-primary">Add Reminder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-title" className="text-lg">
                      Reminder
                    </Label>
                    <Input
                      id="reminder-title"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className="text-lg p-6"
                      placeholder="What do you want to be reminded about?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminder-date" className="text-lg">
                        Date
                      </Label>
                      <Input
                        id="reminder-date"
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="text-lg p-6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-time" className="text-lg">
                        Time
                      </Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="text-lg p-6"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={addReminder} className="text-lg bg-sunshine hover:bg-sunshine/90">
                    Add Reminder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {actions.map((action, index) => (
              <Card key={index} className="card-hover border-2 border-muted">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        action.type === "reminder"
                          ? "bg-coral/20 text-coral"
                          : action.type === "calendar"
                            ? "bg-lavender/20 text-lavender"
                            : "bg-teal/20 text-teal"
                      }`}
                    >
                      {action.type === "reminder" ? (
                        <Clock className="h-6 w-6" />
                      ) : action.type === "calendar" ? (
                        <Calendar className="h-6 w-6" />
                      ) : (
                        <Sparkles className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{action.title}</h3>
                      {action.description && <p className="text-muted-foreground">{action.description}</p>}
                      {action.date && (
                        <p className="text-muted-foreground">
                          {action.date.toLocaleDateString()} {action.time}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`text-base ${
                        action.type === "reminder"
                          ? "border-coral text-coral hover:bg-coral/10"
                          : action.type === "calendar"
                            ? "border-lavender text-lavender hover:bg-lavender/10"
                            : "border-teal text-teal hover:bg-teal/10"
                      }`}
                    >
                      {action.type === "reminder" ? "Complete" : action.type === "calendar" ? "View" : "Do Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="card-hover border-2 border-muted overflow-hidden">
            <div className="bg-gradient-to-r from-sunshine/50 to-coral/50 p-1"></div>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-sunshine/20 p-3 rounded-full shrink-0">
                  <Sparkles className="h-8 w-8 text-sunshine" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-primary">Today's Motivation</h3>
                  <p className="text-lg">
                    "Every step you take to manage your diabetes is a step toward a healthier future. You're doing
                    great, Martha!"
                  </p>
                  <Button
                    variant="outline"
                    className="text-base mt-4 border-sunshine text-sunshine hover:bg-sunshine/10"
                  >
                    Get New Motivation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
