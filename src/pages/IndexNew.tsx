import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { checkRequiredEnvVars } from "@/utils/env";
import type React from "react"
import {
  Bell,
  Calendar,
  Heart,
  LineChart,
  Mic,
  Pill,
  Sparkles,
  Sun,
  Utensils,
  MessageCircle,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
const IndexNew = () => {
  // Initialize PWA features and check environment variables
  useEffect(() => {
    
    // Check for required environment variables
    const missingVars = checkRequiredEnvVars();
    if (missingVars.length > 0) {
      console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    }
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Sun className="h-8 w-8 text-sunshine" />
            DiaVoice
          </h1>
          <p className="text-lg text-muted-foreground">Your AI Companion for Diabetes</p>
        </div>
        <div className="flex gap-2">
          <Button size="lg" variant="outline" className="text-lg gap-2 relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only md:not-sr-only">Alerts</span>
            <span className="absolute -top-1 -right-1 bg-coral text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </Button>
          <Link to="/profile">
            <Button size="lg" variant="outline" className="text-lg">
              Profile
            </Button>
          </Link>
        </div>
      </header>

      {/* Active Check-In Card - Shows when AI is initiating a conversation */}
      <Card className="mb-8 border-2 border-primary overflow-hidden animate-pulse">
        <div className="bg-gradient-to-r from-primary to-secondary p-1"></div>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-primary/20 p-5 rounded-full">
                <Mic className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 text-sm">Morning Check-In</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Good morning, Martha!</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Shall we log your blood sugar now? Also, don't forget your 9AM Metformin.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="text-lg">
                  Yes, let's log it now
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Remind me later
                </Button>
                <Button size="lg" variant="ghost" className="text-lg">
                  I already took it
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Insights - Predictive Health Nudges */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sunshine" />
          Health Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="card-hover border-2 border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary">Blood Sugar Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg">Evening Readings</span>
                    <span className="text-lg font-medium text-coral">Trending Higher</span>
                  </div>
                  <Progress value={75} className="h-3 bg-muted/50">
                    <div className="h-full bg-gradient-to-r from-teal to-coral rounded-full"></div>
                  </Progress>
                </div>
                <p className="text-muted-foreground">
                  Your sugar has been higher in the evenings this week. Would you like to review your dinner options?
                </p>
                <div className="pt-2">
                  <Button variant="outline" className="text-base border-primary text-primary hover:bg-primary/10">
                    Let's discuss dinner options
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-2 border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-secondary">Medication Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium">Metformin</p>
                    <p className="text-muted-foreground">9:00 AM - Due in 30 minutes</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-base">
                    Mark as Taken
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="bg-secondary/20 p-2 rounded-full">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium">15-min Walk</p>
                    <p className="text-muted-foreground">Recommended after lunch</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-base">
                    Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Access */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Talk to DiaVoice About...</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAccessCard
            icon={<LineChart className="h-8 w-8 text-teal" />}
            title="Blood Sugar"
            subtitle="Log or check readings"
            href="/voice-chat?topic=glucose"
            color="bg-teal/10 hover:bg-teal/20"
          />
          <QuickAccessCard
            icon={<Pill className="h-8 w-8 text-coral" />}
            title="Medications"
            subtitle="Reminders & information"
            href="/voice-chat?topic=medications"
            color="bg-coral/10 hover:bg-coral/20"
          />
          <QuickAccessCard
            icon={<Utensils className="h-8 w-8 text-sunshine" />}
            title="Meal Advice"
            subtitle="Personalized guidance"
            href="/voice-chat?topic=meals"
            color="bg-sunshine/10 hover:bg-sunshine/20"
          />
          <QuickAccessCard
            icon={<Heart className="h-8 w-8 text-lavender" />}
            title="How I Feel"
            subtitle="Emotional support"
            href="/voice-chat?topic=wellness"
            color="bg-lavender/10 hover:bg-lavender/20"
          />
        </div>
      </section>

      {/* Upcoming Check-ins */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Schedule
          </h2>
          <Button variant="link" className="text-lg text-secondary">
            View all
          </Button>
        </div>
        <Card className="card-hover border-2 border-muted overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y">
              <ScheduleItem
                time="9:00 AM"
                title="Morning Medication"
                description="Metformin 500mg with breakfast"
                icon={<Pill className="h-5 w-5" />}
                status="upcoming"
              />
              <ScheduleItem
                time="12:30 PM"
                title="Midday Check-in"
                description="Blood sugar check and lunch discussion"
                icon={<MessageCircle className="h-5 w-5" />}
                status="scheduled"
              />
              <ScheduleItem
                time="5:00 PM"
                title="Evening Medication"
                description="Metformin 500mg with dinner"
                icon={<Pill className="h-5 w-5" />}
                status="scheduled"
              />
              <ScheduleItem
                time="8:00 PM"
                title="Evening Check-in"
                description="Review your day and plan for tomorrow"
                icon={<MessageCircle className="h-5 w-5" />}
                status="scheduled"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Caregiver Connection */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Heart className="h-5 w-5 text-coral" />
            Caregiver Connection
          </h2>
          <Button variant="outline" size="sm" className="text-base border-coral text-coral hover:bg-coral/10">
            Settings
          </Button>
        </div>
        <Card className="card-hover border-2 border-muted overflow-hidden">
          <div className="bg-gradient-to-r from-lavender/30 to-coral/30 p-1"></div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-lavender/20 p-3 rounded-full shrink-0">
                <Bell className="h-8 w-8 text-lavender" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">Weekly Update Ready</h3>
                <p className="text-lg mb-4">
                  Your weekly health summary is ready to share with Sarah. It includes your glucose trends, medication
                  adherence, and activity levels.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="text-base">Review & Send</Button>
                  <Button variant="outline" className="text-base">
                    Edit Information
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last update sent: 7 days ago</span>
              </div>
              <Button variant="ghost" size="sm" className="text-sm">
                Manage Sharing
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
};

function QuickAccessCard({
  icon,
  title,
  subtitle,
  href,
  color,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  href: string
  color: string
}) {
  return (
    <Link to={href}>
      <Card className={`h-full transition-all duration-300 card-hover border-2 border-muted ${color}`}>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
          <div className="mb-3">{icon}</div>
          <CardTitle className="text-lg mb-1">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function ScheduleItem({
  time,
  title,
  description,
  icon,
  status,
}: {
  time: string
  title: string
  description: string
  icon: React.ReactNode
  status: "completed" | "upcoming" | "scheduled"
}) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      <div className="text-right min-w-[80px] text-muted-foreground">{time}</div>
      <div
        className={`p-2 rounded-full ${
          status === "completed"
            ? "bg-teal/20 text-teal"
            : status === "upcoming"
              ? "bg-coral/20 text-coral"
              : "bg-lavender/20 text-lavender"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className={`text-sm ${
          status === "completed" ? "text-teal" : status === "upcoming" ? "text-coral" : "text-lavender"
        }`}
      >
        {status === "completed" ? "Completed" : status === "upcoming" ? "Due Soon" : "View"}
      </Button>
    </div>
  )
}
export default IndexNew;
