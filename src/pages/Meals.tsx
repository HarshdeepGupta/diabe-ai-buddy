

import type React from "react"

import { useState } from "react"
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, MessageCircle, Plus, Search, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type MealSuggestion = {
  id: string
  name: string
  description: string
  carbs: string
  protein: string
  fat: string
  glycemicIndex: "low" | "medium" | "high"
  tags: string[]
}

export default function MealsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("suggestions")
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hi Martha! I'm your meal advisor. What kind of meal are you looking for today?",
    },
  ])

  const mealSuggestions: MealSuggestion[] = [
    {
      id: "1",
      name: "Mediterranean Salad with Grilled Chicken",
      description:
        "Mixed greens, cherry tomatoes, cucumber, olives, feta cheese, and grilled chicken with olive oil dressing",
      carbs: "15g",
      protein: "30g",
      fat: "15g",
      glycemicIndex: "low",
      tags: ["protein-rich", "low-carb", "heart-healthy"],
    },
    {
      id: "2",
      name: "Vegetable Omelette with Whole Grain Toast",
      description: "Egg omelette with spinach, bell peppers, and mushrooms, served with a slice of whole grain toast",
      carbs: "20g",
      protein: "18g",
      fat: "12g",
      glycemicIndex: "low",
      tags: ["breakfast", "vegetarian", "high-protein"],
    },
    {
      id: "3",
      name: "Lentil Soup with Side Salad",
      description: "Hearty lentil soup with carrots, celery, and onions, served with a small side salad",
      carbs: "30g",
      protein: "15g",
      fat: "5g",
      glycemicIndex: "medium",
      tags: ["vegetarian", "high-fiber", "lunch"],
    },
    {
      id: "4",
      name: "Baked Salmon with Roasted Vegetables",
      description: "Baked salmon fillet with roasted broccoli, cauliflower, and carrots",
      carbs: "15g",
      protein: "28g",
      fat: "18g",
      glycemicIndex: "low",
      tags: ["dinner", "omega-3", "heart-healthy"],
    },
    {
      id: "5",
      name: "Greek Yogurt with Berries and Nuts",
      description: "Plain Greek yogurt topped with mixed berries and a sprinkle of chopped walnuts",
      carbs: "18g",
      protein: "15g",
      fat: "8g",
      glycemicIndex: "low",
      tags: ["snack", "breakfast", "calcium-rich"],
    },
  ]

  const filteredSuggestions = mealSuggestions.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleChatSend = () => {
    if (chatInput.trim() === "") return

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }])
    const userQuery = chatInput
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (userQuery.toLowerCase().includes("breakfast")) {
        response =
          "For breakfast, I recommend options that are high in protein and fiber but low in simple carbs. Greek yogurt with berries, vegetable omelette with whole grain toast, or overnight oats with nuts are excellent choices for stable blood sugar."
      } else if (userQuery.toLowerCase().includes("lunch")) {
        response =
          "For lunch, try a Mediterranean salad with grilled chicken, a lentil soup with a side salad, or a turkey and avocado wrap with whole grain bread. These options provide a good balance of protein and complex carbohydrates."
      } else if (userQuery.toLowerCase().includes("dinner")) {
        response =
          "For dinner, I recommend baked salmon with roasted vegetables, grilled chicken with quinoa and steamed broccoli, or a tofu stir-fry with plenty of non-starchy vegetables. These meals are nutritious and won't spike your blood sugar."
      } else if (userQuery.toLowerCase().includes("snack")) {
        response =
          "For snacks, consider a small apple with a tablespoon of almond butter, a handful of nuts and seeds, Greek yogurt with berries, or celery sticks with hummus. These options provide nutrients without causing blood sugar spikes."
      } else {
        response =
          "Based on your dietary preferences and diabetes management goals, I recommend focusing on meals that combine lean proteins, healthy fats, and complex carbohydrates. Would you like specific suggestions for breakfast, lunch, dinner, or snacks?"
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleChatSend()
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl welcome-pattern">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">Meal Advisor</h1>
        </div>
        <Button
          onClick={() => setShowChat(!showChat)}
          size="lg"
          variant={showChat ? "default" : "outline"}
          className={`text-lg gap-2 ${showChat ? "bg-sunshine hover:bg-sunshine/90" : "border-sunshine text-sunshine hover:bg-sunshine/10"}`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="sr-only md:not-sr-only">Ask Advisor</span>
        </Button>
      </header>

      {showChat ? (
        <div className="mb-8 border-2 border-muted rounded-lg p-4 h-[500px] flex flex-col bg-white/80 backdrop-blur-sm">
          <div className="flex-1 overflow-auto mb-4">
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-4 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-to-r from-sunshine to-coral/80 text-white"
                    }`}
                  >
                    <p className="text-lg">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about meal suggestions..."
              className="text-lg p-6"
            />
            <Button onClick={handleChatSend} size="lg" className="text-lg bg-sunshine hover:bg-sunshine/90">
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for meal ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg p-6 bg-white/80"
            />
          </div>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
          <TabsTrigger value="suggestions" className="text-lg">
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="log" className="text-lg">
            Meal Log
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-lg">
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((meal) => (
                <Card key={meal.id} className="card-hover border-2 border-muted overflow-hidden">
                  <div
                    className={`h-1 ${
                      meal.glycemicIndex === "low"
                        ? "bg-teal"
                        : meal.glycemicIndex === "medium"
                          ? "bg-sunshine"
                          : "bg-coral"
                    }`}
                  ></div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="bg-muted rounded-lg flex items-center justify-center w-full md:w-48 h-48 shrink-0">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="text-xl font-medium text-primary">{meal.name}</h3>
                          <p className="text-muted-foreground">{meal.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {meal.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-base border-secondary text-secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <NutritionCard label="Carbs" value={meal.carbs} />
                          <NutritionCard label="Protein" value={meal.protein} />
                          <NutritionCard label="Fat" value={meal.fat} />
                        </div>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            meal.glycemicIndex === "low"
                              ? "bg-teal/20 text-teal"
                              : meal.glycemicIndex === "medium"
                                ? "bg-sunshine/20 text-sunshine"
                                : "bg-coral/20 text-coral"
                          }`}
                        >
                          {meal.glycemicIndex.charAt(0).toUpperCase() + meal.glycemicIndex.slice(1)} Glycemic Index
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-base gap-1 border-secondary text-secondary hover:bg-secondary/10"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            Save to Favorites
                          </Button>
                          <Button size="sm" className="text-base bg-secondary hover:bg-secondary/90">
                            Add to Meal Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="card-hover border-2 border-muted">
                <CardContent className="p-6 text-center">
                  <p className="text-lg text-muted-foreground">No meals found matching your search.</p>
                  <Button className="mt-4 text-lg bg-sunshine hover:bg-sunshine/90" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="log" className="mt-6">
          <Card className="card-hover border-2 border-muted">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Today's Meals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-muted rounded-lg flex items-center justify-center w-full md:w-48 h-48 shrink-0">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">Oatmeal with Berries</h3>
                      <span className="text-muted-foreground">8:15 AM</span>
                    </div>
                    <p className="text-muted-foreground">1 cup oatmeal, 1/2 cup mixed berries, 1 tbsp honey</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <NutritionCard label="Carbs" value="30g" />
                    <NutritionCard label="Protein" value="5g" />
                    <NutritionCard label="Fat" value="3g" />
                  </div>
                  <div className="pt-2">
                    <p className="text-teal font-medium">Blood sugar: 125 mg/dL (after meal)</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-muted rounded-lg flex items-center justify-center w-full md:w-48 h-48 shrink-0">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">Grilled Chicken Salad</h3>
                      <span className="text-muted-foreground">12:30 PM</span>
                    </div>
                    <p className="text-muted-foreground">
                      3oz grilled chicken, mixed greens, cherry tomatoes, olive oil dressing
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <NutritionCard label="Carbs" value="10g" />
                    <NutritionCard label="Protein" value="25g" />
                    <NutritionCard label="Fat" value="15g" />
                  </div>
                  <div className="pt-2">
                    <p className="text-teal font-medium">Blood sugar: 118 mg/dL (after meal)</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button size="lg" className="text-lg gap-2 bg-sunshine hover:bg-sunshine/90">
                  <Plus className="h-5 w-5" />
                  Add Meal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <Card className="card-hover border-2 border-muted">
            <CardContent className="p-6 text-center">
              <p className="text-xl text-muted-foreground">You haven't saved any favorite meals yet.</p>
              <p className="text-lg text-muted-foreground mt-2">
                Browse meal suggestions and click "Save to Favorites" to add them here.
              </p>
              <Button
                className="mt-4 text-lg bg-sunshine hover:bg-sunshine/90"
                onClick={() => setActiveTab("suggestions")}
              >
                Browse Suggestions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NutritionCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg text-center">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  )
}
