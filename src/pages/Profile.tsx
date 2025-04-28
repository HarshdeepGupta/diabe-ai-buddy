

import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfilePage() {
  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <header className="flex items-center mb-8">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Personal Information</CardTitle>
          <CardDescription className="text-lg">This information helps us personalize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                Full Name
              </Label>
              <Input id="name" defaultValue="Martha Johnson" className="text-lg p-6" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-lg">
                Age
              </Label>
              <Input id="age" type="number" defaultValue="68" className="text-lg p-6" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-lg">
              Country
            </Label>
            <Select defaultValue="us">
              <SelectTrigger id="country" className="text-lg p-6">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="in">India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Gender</Label>
            <RadioGroup defaultValue="female" className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="h-5 w-5" />
                <Label htmlFor="male" className="text-lg">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="h-5 w-5" />
                <Label htmlFor="female" className="text-lg">
                  Female
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" className="h-5 w-5" />
                <Label htmlFor="other" className="text-lg">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Medical Information</CardTitle>
          <CardDescription className="text-lg">
            This helps us provide personalized advice and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-lg">
              Diabetes Type
            </Label>
            <Select defaultValue="type2">
              <SelectTrigger id="diagnosis" className="text-lg p-6">
                <SelectValue placeholder="Select your diabetes type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type1">Type 1 Diabetes</SelectItem>
                <SelectItem value="type2">Type 2 Diabetes</SelectItem>
                <SelectItem value="prediabetes">Prediabetes</SelectItem>
                <SelectItem value="gestational">Gestational Diabetes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis-year" className="text-lg">
              Year of Diagnosis
            </Label>
            <Input id="diagnosis-year" type="number" defaultValue="2018" className="text-lg p-6" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications" className="text-lg">
              Current Medications
            </Label>
            <Textarea
              id="medications"
              defaultValue="Metformin 500mg twice daily, Glipizide 5mg once daily"
              className="text-lg p-6 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-lg">
              Allergies
            </Label>
            <Textarea
              id="allergies"
              defaultValue="Penicillin, Shellfish"
              placeholder="List any allergies or sensitivities"
              className="text-lg p-6 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="a1c" className="text-lg">
              Latest A1C Reading
            </Label>
            <div className="flex gap-4">
              <Input id="a1c" type="text" defaultValue="7.2" className="text-lg p-6" />
              <Input id="a1c-date" type="date" defaultValue="2025-03-15" className="text-lg p-6" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-range" className="text-lg">
              Target Blood Sugar Range
            </Label>
            <div className="flex items-center gap-4">
              <Input id="target-range-low" type="number" defaultValue="80" className="text-lg p-6" />
              <span className="text-lg">to</span>
              <Input id="target-range-high" type="number" defaultValue="140" className="text-lg p-6" />
              <span className="text-lg">mg/dL</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Preferences</CardTitle>
          <CardDescription className="text-lg">Customize how DiaBuddy works for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goals" className="text-lg">
              Your Health Goals
            </Label>
            <Textarea
              id="goals"
              defaultValue="Improve my A1C, lose 10 pounds, be more active"
              placeholder="What are your health goals?"
              className="text-lg p-6 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Reminder Preferences</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="medication-reminders" defaultChecked className="h-5 w-5" />
                <Label htmlFor="medication-reminders" className="text-lg">
                  Medication Reminders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="glucose-reminders" defaultChecked className="h-5 w-5" />
                <Label htmlFor="glucose-reminders" className="text-lg">
                  Glucose Check Reminders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="exercise-reminders" defaultChecked className="h-5 w-5" />
                <Label htmlFor="exercise-reminders" className="text-lg">
                  Exercise Reminders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="appointment-reminders" defaultChecked className="h-5 w-5" />
                <Label htmlFor="appointment-reminders" className="text-lg">
                  Appointment Reminders
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary" className="text-lg">
              Dietary Preferences
            </Label>
            <Select defaultValue="no-restrictions">
              <SelectTrigger id="dietary" className="text-lg p-6">
                <SelectValue placeholder="Select your dietary preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-restrictions">No Restrictions</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                <SelectItem value="low-carb">Low Carb</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" className="text-lg gap-2">
          <Save className="h-5 w-5" />
          Save Profile
        </Button>
      </div>
    </div>
  )
}
