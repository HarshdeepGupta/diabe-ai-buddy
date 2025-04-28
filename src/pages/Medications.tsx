

import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Check, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MedicationsPage() {
  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <header className="flex items-center mb-8">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Medications</h1>
      </header>

      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            <TabsTrigger value="today" className="text-lg">
              Today
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-lg">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="all" className="text-lg">
              All Meds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Morning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MedicationItem
                  name="Metformin"
                  dosage="500mg"
                  time="8:00 AM"
                  instructions="Take with breakfast"
                  status="taken"
                />
                <MedicationItem
                  name="Glipizide"
                  dosage="5mg"
                  time="8:00 AM"
                  instructions="Take with breakfast"
                  status="taken"
                />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Afternoon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MedicationItem
                  name="Metformin"
                  dosage="500mg"
                  time="1:00 PM"
                  instructions="Take with lunch"
                  status="upcoming"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Evening</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MedicationItem
                  name="Metformin"
                  dosage="500mg"
                  time="7:00 PM"
                  instructions="Take with dinner"
                  status="upcoming"
                />
                <MedicationItem
                  name="Glipizide"
                  dosage="5mg"
                  time="7:00 PM"
                  instructions="Take with dinner"
                  status="upcoming"
                />
                <MedicationItem
                  name="Vitamin D"
                  dosage="1000 IU"
                  time="7:00 PM"
                  instructions="Take with dinner"
                  status="upcoming"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <p className="text-xl text-center text-muted-foreground">
                  Switch to the "Today" tab to see today's medications
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <p className="text-xl text-center text-muted-foreground">
                  Switch to the "Today" tab to see today's medications
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button size="lg" className="text-lg gap-2">
          <Plus className="h-5 w-5" />
          <span>Add Medication</span>
        </Button>
      </div>
    </div>
  )
}

function MedicationItem({
  name,
  dosage,
  time,
  instructions,
  status,
}: {
  name: string
  dosage: string
  time: string
  instructions: string
  status: "taken" | "upcoming" | "missed"
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div
        className={`p-3 rounded-full ${
          status === "taken"
            ? "bg-green-100 text-green-600"
            : status === "upcoming"
              ? "bg-blue-100 text-blue-600"
              : "bg-red-100 text-red-600"
        }`}
      >
        {status === "taken" ? (
          <Check className="h-6 w-6" />
        ) : status === "upcoming" ? (
          <Clock className="h-6 w-6" />
        ) : (
          <Bell className="h-6 w-6" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">{name}</h3>
          <span className="text-lg">{time}</span>
        </div>
        <p className="text-muted-foreground">
          {dosage} - {instructions}
        </p>
      </div>
      {status === "upcoming" && (
        <Button variant="outline" size="lg" className="text-base">
          Mark as Taken
        </Button>
      )}
    </div>
  )
}
