import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";

// Validation schema
const basicInfoSchema = z.object({
  age: z.number().min(18, "Age must be at least 18").max(120, "Age must be less than 120"),
  weight: z.number().min(30, "Weight must be at least 30").max(500, "Weight must be less than 500"),
  weightUnit: z.enum(["kg", "lbs"]),
  t2dDuration: z.number().min(0, "Duration must be at least 0").max(80, "Duration must be less than 80"),
});

export default function BasicInfoForm() {
  const { profile, setProfile, currentStep, setCurrentStep } = useProfile();
  
  // Default values or from existing profile
  const [formData, setFormData] = useState({
    age: profile?.age || "",
    weight: profile?.weight || "",
    weightUnit: profile?.weightUnit || "kg",
    t2dDuration: profile?.t2dDuration || "",
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  const handleWeightUnitChange = (value: "kg" | "lbs") => {
    setFormData({
      ...formData,
      weightUnit: value,
    });
  };

  const validateForm = () => {
    try {
      // Convert string values to numbers for validation
      const numericData = {
        age: Number(formData.age),
        weight: Number(formData.weight),
        weightUnit: formData.weightUnit as "kg" | "lbs",
        t2dDuration: Number(formData.t2dDuration),
      };
      
      basicInfoSchema.parse(numericData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      // Convert string values to numbers for storage
      const numericData = {
        age: Number(formData.age),
        weight: Number(formData.weight),
        weightUnit: formData.weightUnit as "kg" | "lbs",
        t2dDuration: Number(formData.t2dDuration),
        // Keep existing values for other fields
        medications: profile?.medications || [],
        activityPreferences: profile?.activityPreferences || [],
      };
      
      setProfile(numericData);
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-diabetes-800">
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Your Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleInputChange}
              className={errors.age ? "border-destructive" : ""}
            />
            {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Your Weight</Label>
            <div className="flex space-x-2">
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="Enter your weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={errors.weight ? "border-destructive" : ""}
              />
              <RadioGroup
                value={formData.weightUnit}
                onValueChange={handleWeightUnitChange}
                className="flex flex-row space-x-1 h-10"
              >
                <div className="flex items-center space-x-1 bg-gray-100 rounded-md px-3">
                  <RadioGroupItem value="kg" id="kg" />
                  <Label htmlFor="kg" className="cursor-pointer">kg</Label>
                </div>
                <div className="flex items-center space-x-1 bg-gray-100 rounded-md px-3">
                  <RadioGroupItem value="lbs" id="lbs" />
                  <Label htmlFor="lbs" className="cursor-pointer">lbs</Label>
                </div>
              </RadioGroup>
            </div>
            {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="t2dDuration">Years Since Diagnosis</Label>
            <Input
              id="t2dDuration"
              name="t2dDuration"
              type="number"
              placeholder="Enter years since diagnosis"
              value={formData.t2dDuration}
              onChange={handleInputChange}
              className={errors.t2dDuration ? "border-destructive" : ""}
            />
            {errors.t2dDuration && <p className="text-sm text-destructive">{errors.t2dDuration}</p>}
          </div>
          
          <Button 
            onClick={handleNext} 
            className="w-full bg-diabetes-600 hover:bg-diabetes-700"
          >
            Next: Medication Information
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
