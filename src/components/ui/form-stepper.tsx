
import React from "react";
import { cn } from "@/lib/utils";

interface FormStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function FormStepper({ steps, currentStep, onStepClick }: FormStepperProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div 
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                index <= currentStep 
                  ? "bg-diabetes-600 text-white" 
                  : "bg-gray-200 text-gray-500",
                onStepClick ? "cursor-pointer hover:opacity-90" : ""
              )}
              onClick={() => onStepClick && index < currentStep && onStepClick(index)}
            >
              {index < currentStep ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2">
                <div 
                  className={cn(
                    "h-full",
                    index < currentStep 
                      ? "bg-diabetes-600" 
                      : "bg-gray-200"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "text-xs sm:text-sm font-medium transition-colors",
              index <= currentStep ? "text-diabetes-700" : "text-gray-500"
            )}
            style={{ 
              width: `${100 / steps.length}%`, 
              textAlign: index === 0 ? 'left' : index === steps.length - 1 ? 'right' : 'center',
              paddingLeft: index === 0 ? '4px' : 0,
              paddingRight: index === steps.length - 1 ? '4px' : 0,
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
