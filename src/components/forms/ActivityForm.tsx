
import { useState } from "react";
import { useProfile, ActivityPreference } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Plus } from "lucide-react";
import { z } from "zod";

// Validation schema
const activitySchema = z.object({
  type: z.string().min(1, "Activity type is required"),
  intensity: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Intensity selection is required" }),
  }),
  preferredTime: z.string().min(1, "Preferred time is required"),
});

const activitiesSchema = z.array(activitySchema).min(1, "At least one activity preference is required");

export default function ActivityForm() {
  const { profile, setProfile, currentStep, setCurrentStep } = useProfile();
  
  // Initialize activities from profile or with an empty one
  const [activities, setActivities] = useState<ActivityPreference[]>(
    profile?.activityPreferences?.length 
      ? profile.activityPreferences 
      : [{ type: "", intensity: "medium", preferredTime: "" }]
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (index: number, field: keyof ActivityPreference, value: string) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    };
    setActivities(updatedActivities);
    
    // Clear error when user types
    const errorKey = `activities[${index}].${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const addActivity = () => {
    setActivities([...activities, { type: "", intensity: "medium", preferredTime: "" }]);
  };

  const removeActivity = (index: number) => {
    if (activities.length > 1) {
      const updatedActivities = [...activities];
      updatedActivities.splice(index, 1);
      setActivities(updatedActivities);
    }
  };

  const validateForm = () => {
    try {
      activitiesSchema.parse(activities);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const errorKey = `activities[${err.path[0]}].${err.path[1]}`;
            newErrors[errorKey] = err.message;
          } else {
            // General array error
            newErrors.general = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      // Update profile with activities
      setProfile({
        ...profile!,
        activityPreferences: activities,
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Common activity types
  const activityTypes = [
    "Walking",
    "Swimming",
    "Cycling",
    "Light jogging",
    "Resistance training",
    "Yoga",
    "Tai Chi",
    "Stretching",
    "Water aerobics",
    "Dancing",
  ];

  // Common time preferences
  const timePreferences = [
    "Early morning",
    "Mid-morning",
    "Afternoon",
    "Evening",
    "After breakfast",
    "After lunch",
    "After dinner",
    "Before bed",
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-diabetes-800">
          Activity Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {errors.general && (
            <p className="text-sm text-destructive text-center">{errors.general}</p>
          )}
          
          {activities.map((activity, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Activity {index + 1}</h3>
                {activities.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivity(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`activity-type-${index}`}>Activity Type</Label>
                <Select
                  value={activity.type}
                  onValueChange={(value) => handleInputChange(index, "type", value)}
                >
                  <SelectTrigger 
                    id={`activity-type-${index}`}
                    className={errors[`activities[${index}].type`] ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`activities[${index}].type`] && (
                  <p className="text-sm text-destructive">{errors[`activities[${index}].type`]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Intensity</Label>
                <RadioGroup
                  value={activity.intensity}
                  onValueChange={(value) => handleInputChange(index, "intensity", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="low" 
                      id={`intensity-low-${index}`} 
                      className={errors[`activities[${index}].intensity`] ? "text-destructive" : ""}
                    />
                    <Label htmlFor={`intensity-low-${index}`} className="cursor-pointer">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="medium" 
                      id={`intensity-medium-${index}`}
                      className={errors[`activities[${index}].intensity`] ? "text-destructive" : ""}
                    />
                    <Label htmlFor={`intensity-medium-${index}`} className="cursor-pointer">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="high" 
                      id={`intensity-high-${index}`}
                      className={errors[`activities[${index}].intensity`] ? "text-destructive" : ""} 
                    />
                    <Label htmlFor={`intensity-high-${index}`} className="cursor-pointer">High</Label>
                  </div>
                </RadioGroup>
                {errors[`activities[${index}].intensity`] && (
                  <p className="text-sm text-destructive">{errors[`activities[${index}].intensity`]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`preferred-time-${index}`}>Preferred Time</Label>
                <Select
                  value={activity.preferredTime}
                  onValueChange={(value) => handleInputChange(index, "preferredTime", value)}
                >
                  <SelectTrigger 
                    id={`preferred-time-${index}`}
                    className={errors[`activities[${index}].preferredTime`] ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timePreferences.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`activities[${index}].preferredTime`] && (
                  <p className="text-sm text-destructive">{errors[`activities[${index}].preferredTime`]}</p>
                )}
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addActivity}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Activity
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleBack}
              variant="outline" 
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="flex-1 bg-diabetes-600 hover:bg-diabetes-700"
            >
              Review & Generate Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
