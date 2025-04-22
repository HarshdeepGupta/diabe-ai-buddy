
import { useState } from "react";
import { useProfile, Medication } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { z } from "zod";

// Validation schema
const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  timing: z.string().min(1, "Timing is required"),
});

const medicationsSchema = z.array(medicationSchema).min(1, "At least one medication is required");

export default function MedicationForm() {
  const { profile, setProfile, currentStep, setCurrentStep } = useProfile();
  
  // Initialize medications from profile or with an empty one
  const [medications, setMedications] = useState<Medication[]>(
    profile?.medications?.length ? profile.medications : [{ name: "", dosage: "", timing: "" }]
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setMedications(updatedMedications);
    
    // Clear error when user types
    const errorKey = `medications[${index}].${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", timing: "" }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      setMedications(updatedMedications);
    }
  };

  const validateForm = () => {
    try {
      medicationsSchema.parse(medications);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const errorKey = `medications[${err.path[0]}].${err.path[1]}`;
            newErrors[errorKey] = err.message;
          } else {
            // General array error (e.g., "at least one medication is required")
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
      // Update profile with medications
      setProfile({
        ...profile!,
        medications,
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Common timing options
  const timingOptions = [
    "Morning before breakfast",
    "Morning after breakfast",
    "Afternoon before lunch",
    "Afternoon after lunch", 
    "Evening before dinner",
    "Evening after dinner",
    "Before bed",
    "With meals",
    "As needed",
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-diabetes-800">
          Medication Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {errors.general && (
            <p className="text-sm text-destructive text-center">{errors.general}</p>
          )}
          
          {medications.map((medication, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Medication {index + 1}</h3>
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-name-${index}`}>Medication Name</Label>
                <Input
                  id={`med-name-${index}`}
                  value={medication.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  placeholder="e.g., Metformin"
                  className={errors[`medications[${index}].name`] ? "border-destructive" : ""}
                />
                {errors[`medications[${index}].name`] && (
                  <p className="text-sm text-destructive">{errors[`medications[${index}].name`]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                <Input
                  id={`med-dosage-${index}`}
                  value={medication.dosage}
                  onChange={(e) => handleInputChange(index, "dosage", e.target.value)}
                  placeholder="e.g., 500mg"
                  className={errors[`medications[${index}].dosage`] ? "border-destructive" : ""}
                />
                {errors[`medications[${index}].dosage`] && (
                  <p className="text-sm text-destructive">{errors[`medications[${index}].dosage`]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-timing-${index}`}>When to Take</Label>
                <Select
                  value={medication.timing}
                  onValueChange={(value) => handleInputChange(index, "timing", value)}
                >
                  <SelectTrigger 
                    id={`med-timing-${index}`}
                    className={errors[`medications[${index}].timing`] ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select timing" />
                  </SelectTrigger>
                  <SelectContent>
                    {timingOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`medications[${index}].timing`] && (
                  <p className="text-sm text-destructive">{errors[`medications[${index}].timing`]}</p>
                )}
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addMedication}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Medication
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
              Next: Activity Preferences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
