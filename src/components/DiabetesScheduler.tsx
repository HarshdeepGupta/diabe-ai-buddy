
import { FormStepper } from "@/components/ui/form-stepper";
import { useProfile } from "@/context/ProfileContext";
import BasicInfoForm from "@/components/forms/BasicInfoForm";
import MedicationForm from "@/components/forms/MedicationForm";
import ActivityForm from "@/components/forms/ActivityForm";
import ReviewForm from "@/components/forms/ReviewForm";

export default function DiabetesScheduler() {
  const { currentStep, setCurrentStep } = useProfile();
  
  // Define step titles
  const steps = [
    "Basic Info",
    "Medications",
    "Activities",
    "Review"
  ];
  
  // Handle step navigation when user clicks on a step in the stepper
  const handleStepClick = (stepIndex: number) => {
    // Only allow going back to previous steps, not skipping ahead
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };
  
  // Render the appropriate form component based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm />;
      case 1:
        return <MedicationForm />;
      case 2:
        return <ActivityForm />;
      case 3:
        return <ReviewForm />;
      default:
        return <BasicInfoForm />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <FormStepper 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
      {renderStepContent()}
    </div>
  );
}
