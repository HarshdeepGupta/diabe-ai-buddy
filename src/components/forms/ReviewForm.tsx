
import { useState } from "react";
import { useProfile, CalendarEvent } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateSchedule } from "@/services/ai";
import { authorizeGoogleCalendar, createCalendarEvents } from "@/services/calendar";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ReviewForm() {
  const { profile, currentStep, setCurrentStep, setGeneratedSchedule, generatedSchedule, isLoading, setIsLoading, error, setError } = useProfile();
  const { toast } = useToast();
  
  const [calendarAuthorized, setCalendarAuthorized] = useState(false);
  const [eventsCreated, setEventsCreated] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleGenerateSchedule = async () => {
    if (!profile) return;
    
    try {
      setIsLoading(true);
      setProcessingStep("Generating your personalized schedule...");
      setError(null);
      
      // Generate schedule using AI
      const events = await generateSchedule(profile);
      setGeneratedSchedule(events);
      
      toast({
        title: "Schedule Generated",
        description: "Your personalized diabetes management schedule has been created.",
      });
      
      setProcessingStep(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate schedule";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorizeCalendar = async () => {
    try {
      setIsLoading(true);
      setProcessingStep("Connecting to Google Calendar...");
      setError(null);
      
      // Authorize with Google Calendar
      const result = await authorizeGoogleCalendar();
      
      if (result.success) {
        setCalendarAuthorized(true);
        toast({
          title: "Calendar Connected",
          description: "Successfully connected to Google Calendar",
        });
      } else {
        throw new Error(result.error || "Failed to connect to Google Calendar");
      }
      
      setProcessingStep(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect to Google Calendar";
      setError(message);
      toast({
        title: "Calendar Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvents = async () => {
    if (!generatedSchedule.length) return;
    
    try {
      setIsLoading(true);
      setProcessingStep("Creating calendar events...");
      setError(null);
      
      // Create events in Google Calendar
      const result = await createCalendarEvents(generatedSchedule);
      
      if (result.success) {
        setEventsCreated(true);
        toast({
          title: "Events Created",
          description: `Successfully added ${result.createdEvents} events to your calendar`,
        });
      } else {
        throw new Error(result.error || "Failed to create calendar events");
      }
      
      setProcessingStep(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create calendar events";
      setError(message);
      toast({
        title: "Calendar Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  // Format a date string for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-diabetes-800">
          Review & Generate
        </CardTitle>
        <CardDescription className="text-center">
          Review your information and generate your personalized schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basic-info">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Age:</span>
                    <span>{profile?.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{profile?.weight} {profile?.weightUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Diabetes Duration:</span>
                    <span>{profile?.t2dDuration} years</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="medications">
              <AccordionTrigger>Medications</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  {profile?.medications.map((med, index) => (
                    <div key={index} className="p-3 border rounded bg-gray-50">
                      <div className="font-medium">{med.name}</div>
                      <div className="text-gray-600">Dosage: {med.dosage}</div>
                      <div className="text-gray-600">Timing: {med.timing}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="activities">
              <AccordionTrigger>Activity Preferences</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  {profile?.activityPreferences.map((activity, index) => (
                    <div key={index} className="p-3 border rounded bg-gray-50">
                      <div className="font-medium">{activity.type}</div>
                      <div className="text-gray-600">
                        Intensity: <span className="capitalize">{activity.intensity}</span>
                      </div>
                      <div className="text-gray-600">Preferred Time: {activity.preferredTime}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            {/* Generate Schedule Button */}
            {!generatedSchedule.length ? (
              <Button 
                onClick={handleGenerateSchedule} 
                disabled={isLoading} 
                className="w-full bg-diabetes-600 hover:bg-diabetes-700"
              >
                {isLoading && processingStep === "Generating your personalized schedule..." ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Generating Schedule...
                  </>
                ) : (
                  "Generate Your Schedule"
                )}
              </Button>
            ) : (
              <div className="flex items-center text-green-600 font-medium">
                <CheckCircle2 className="mr-2 h-5 w-5" /> Schedule Generated Successfully
              </div>
            )}
            
            {/* Display Generated Schedule */}
            {generatedSchedule.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="font-semibold text-diabetes-800">Your Personalized Schedule</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 text-sm border p-3 rounded-md">
                  {generatedSchedule.map((event, index) => (
                    <div key={index} className={`p-2 rounded-md ${
                      event.type === 'medication' ? 'bg-diabetes-100 border-l-4 border-diabetes-500' : 
                      event.type === 'exercise' ? 'bg-health-100 border-l-4 border-health-500' : 
                      'bg-gray-100 border-l-4 border-gray-500'
                    }`}>
                      <div className="font-medium">{event.title}</div>
                      <div>{formatDate(event.startTime)}</div>
                      <div className="text-xs text-gray-600 mt-1">{event.description}</div>
                    </div>
                  ))}
                </div>
                
                {/* Connect to Calendar */}
                {!calendarAuthorized ? (
                  <Button 
                    onClick={handleAuthorizeCalendar} 
                    disabled={isLoading} 
                    className="w-full bg-diabetes-600 hover:bg-diabetes-700"
                  >
                    {isLoading && processingStep === "Connecting to Google Calendar..." ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Connecting to Calendar...
                      </>
                    ) : (
                      "Connect to Google Calendar"
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center text-green-600 font-medium">
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Connected to Google Calendar
                  </div>
                )}
                
                {/* Add Events to Calendar */}
                {calendarAuthorized && !eventsCreated && (
                  <Button 
                    onClick={handleCreateEvents} 
                    disabled={isLoading} 
                    className="w-full bg-diabetes-600 hover:bg-diabetes-700"
                  >
                    {isLoading && processingStep === "Creating calendar events..." ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Adding Events to Calendar...
                      </>
                    ) : (
                      "Add Events to Calendar"
                    )}
                  </Button>
                )}
                
                {/* Success Message */}
                {eventsCreated && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700 text-center">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">All Set!</p>
                    <p className="text-sm mt-1">
                      Your personalized diabetes management schedule has been added to your Google Calendar.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleBack}
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              Back
            </Button>
            {eventsCreated && (
              <Button 
                onClick={handleReset} 
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                Create New Schedule
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
