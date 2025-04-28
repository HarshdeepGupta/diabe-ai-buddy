

import { useState } from "react"
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlucoseChart } from "@/components/glucose-chart"

export default function GlucosePage() {
  const [activeTab, setActiveTab] = useState("week")

  // Sample data for the glucose readings
  const glucoseData = [
    { date: "Mon", value: 120, time: "8:00 AM" },
    { date: "Tue", value: 135, time: "8:15 AM" },
    { date: "Wed", value: 115, time: "7:45 AM" },
    { date: "Thu", value: 125, time: "8:30 AM" },
    { date: "Fri", value: 110, time: "8:00 AM" },
    { date: "Sat", value: 130, time: "9:00 AM" },
    { date: "Sun", value: 120, time: "8:20 AM" },
  ]

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <header className="flex items-center mb-8">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Blood Glucose Log</h1>
      </header>

      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="week" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            <TabsTrigger value="day" className="text-lg">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="text-lg">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="text-lg">
              Month
            </TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="mt-6">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Today's Readings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <GlucoseChart data={glucoseData.slice(0, 1)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="mt-6">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Weekly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <GlucoseChart data={glucoseData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="mt-6">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <GlucoseChart data={glucoseData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button size="lg" className="text-lg gap-2">
          <Plus className="h-5 w-5" />
          <span>Add Reading</span>
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recent Readings</h2>
      <div className="space-y-4">
        {glucoseData
          .slice()
          .reverse()
          .map((reading, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium">{reading.date}</p>
                    <p className="text-muted-foreground">{reading.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {reading.value} <span className="text-lg font-normal">mg/dL</span>
                    </p>
                    <p
                      className={`text-lg ${
                        reading.value > 140 ? "text-red-500" : reading.value < 100 ? "text-amber-500" : "text-green-500"
                      }`}
                    >
                      {reading.value > 140 ? "High" : reading.value < 100 ? "Low" : "Normal"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
