

import type React from "react"

import { useState } from "react"
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Calendar,
  Download,
  Heart,
  LineChart,
  MessageCircle,
  Pill,
  Settings,
  Share2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CaregiverPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Caregiver Dashboard</h1>
            <p className="text-muted-foreground">Monitoring Martha Johnson</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="lg" variant="outline" className="text-lg gap-2 relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only md:not-sr-only">Alerts</span>
            <span className="absolute -top-1 -right-1 bg-coral text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </Button>
          <Button size="lg" variant="outline" className="text-lg">
            <Settings className="h-5 w-5" />
            <span className="sr-only md:not-sr-only">Settings</span>
          </Button>
        </div>
      </header>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
          <TabsTrigger value="overview" className="text-lg">
            Overview
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-lg">
            Reports
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-lg">
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card className="border-2 border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary">Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg">Blood Sugar Control</span>
                    <span className="text-lg font-medium">85% in range</span>
                  </div>
                  <Progress value={85} className="h-3 progress-bar-gradient" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg">Medication Adherence</span>
                    <span className="text-lg font-medium">95% on time</span>
                  </div>
                  <Progress value={95} className="h-3 progress-bar-gradient" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg">Activity Goals</span>
                    <span className="text-lg font-medium">70% completed</span>
                  </div>
                  <Progress value={70} className="h-3 progress-bar-gradient" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg">Mood & Wellness</span>
                    <span className="text-lg font-medium">Mostly positive</span>
                  </div>
                  <Progress value={80} className="h-3 progress-bar-gradient" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-muted-foreground">Last updated: Today, 8:30 AM</span>
                <Button variant="outline" size="sm" className="text-sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download Report
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">Recent Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-coral/10 rounded-lg border border-coral/30">
                  <div className="flex items-center gap-2 mb-1">
                    <LineChart className="h-5 w-5 text-coral" />
                    <h3 className="font-medium">Evening Blood Sugar</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Martha's evening readings have been trending higher this week. This pattern often relates to dinner
                    choices.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-sm border-coral text-coral hover:bg-coral/10"
                  >
                    View Details
                  </Button>
                </div>
                <div className="p-3 bg-lavender/10 rounded-lg border border-lavender/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-5 w-5 text-lavender" />
                    <h3 className="font-medium">Mood Patterns</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Martha has reported feeling tired more frequently in the afternoons. This might be related to
                    post-lunch glucose levels.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-sm border-lavender text-lavender hover:bg-lavender/10"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <ScheduleItem
                    time="Today, 9:00 AM"
                    title="Morning Medication"
                    description="Metformin 500mg with breakfast"
                    icon={<Pill className="h-5 w-5" />}
                    status="completed"
                  />
                  <ScheduleItem
                    time="Today, 12:30 PM"
                    title="Midday Check-in"
                    description="Blood sugar check and lunch discussion"
                    icon={<MessageCircle className="h-5 w-5" />}
                    status="upcoming"
                  />
                  <ScheduleItem
                    time="Tomorrow, 10:00 AM"
                    title="Doctor's Appointment"
                    description="Dr. Johnson - Endocrinologist"
                    icon={<User className="h-5 w-5" />}
                    status="scheduled"
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-3">
                <Button variant="link" className="text-sm mx-auto">
                  View Full Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="border-2 border-muted">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-primary">Communication</CardTitle>
                <Button variant="outline" size="sm" className="text-sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Send Message
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">Last Conversation</h3>
                  <span className="text-sm text-muted-foreground">Yesterday, 4:15 PM</span>
                </div>
                <p className="text-muted-foreground mb-2">
                  Martha discussed her dinner options and received recommendations for low-glycemic meals.
                </p>
                <Button variant="link" className="text-sm p-0 h-auto">
                  View Conversation
                </Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">Weekly Check-in Call</h3>
                  <Badge variant="outline" className="text-xs">
                    Scheduled
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  Your weekly video check-in with Martha is scheduled for Saturday at 10:00 AM.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-sm">
                    Reschedule
                  </Button>
                  <Button size="sm" className="text-sm">
                    Join Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="border-2 border-muted mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Available Reports</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <LineChart className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-medium">Weekly Glucose Report</h4>
                      <p className="text-sm text-muted-foreground">May 1 - May 7, 2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" className="text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Pill className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-medium">Medication Adherence Report</h4>
                      <p className="text-sm text-muted-foreground">May 1 - May 7, 2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" className="text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-medium">Wellness & Mood Report</h4>
                      <p className="text-sm text-muted-foreground">May 1 - May 7, 2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" className="text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full text-lg py-6">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Report with Healthcare Provider
          </Button>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card className="border-2 border-muted mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-coral/10 rounded-lg border border-coral/30">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-coral" />
                    <h3 className="font-medium">High Evening Blood Sugar</h3>
                  </div>
                  <Badge variant="outline" className="text-xs border-coral text-coral">
                    New
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  Martha's blood sugar was 180 mg/dL after dinner yesterday, which is above her target range.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Yesterday, 8:30 PM</span>
                  <Button size="sm" className="text-sm bg-coral hover:bg-coral/90">
                    Take Action
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Missed Morning Medication</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Resolved
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  Martha missed her morning Metformin dose on Monday. She took it 2 hours later after a reminder.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Monday, 11:15 AM</span>
                  <Button variant="outline" size="sm" className="text-sm">
                    View Details
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Low Blood Sugar Episode</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Resolved
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  Martha experienced a low blood sugar reading (68 mg/dL) last week. She followed the proper protocol.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">April 28, 2025, 3:45 PM</span>
                  <Button variant="outline" size="sm" className="text-sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary">Alert Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">Blood Sugar Alerts</h4>
                  <p className="text-sm text-muted-foreground">Notify when readings are outside target range</p>
                </div>
                <Button variant="outline" size="sm" className="text-sm">
                  Configure
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">Medication Alerts</h4>
                  <p className="text-sm text-muted-foreground">Notify when medications are missed</p>
                </div>
                <Button variant="outline" size="sm" className="text-sm">
                  Configure
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">Emergency Alerts</h4>
                  <p className="text-sm text-muted-foreground">Immediate notification for urgent situations</p>
                </div>
                <Button variant="outline" size="sm" className="text-sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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
